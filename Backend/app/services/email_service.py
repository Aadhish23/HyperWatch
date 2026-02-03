"""
Email service for sending notifications and alerts.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SMTP."""
    
    @staticmethod
    async def send_email(
        to_email: str,
        subject: str,
        html_content: str,
        plain_text: Optional[str] = None
    ) -> bool:
        """
        Send an email to a single recipient.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML content of the email
            plain_text: Plain text version (optional)
            
        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            # Check if email is configured
            if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
                logger.warning("Email not configured. Skipping email send.")
                return False
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL or settings.SMTP_USER}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add plain text version
            if plain_text:
                part1 = MIMEText(plain_text, 'plain')
                msg.attach(part1)
            
            # Add HTML version
            part2 = MIMEText(html_content, 'html')
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    @staticmethod
    async def send_bulk_email(
        to_emails: List[str],
        subject: str,
        html_content: str,
        plain_text: Optional[str] = None
    ) -> dict:
        """
        Send emails to multiple recipients.
        
        Args:
            to_emails: List of recipient email addresses
            subject: Email subject
            html_content: HTML content of the email
            plain_text: Plain text version (optional)
            
        Returns:
            Dictionary with success and failure counts
        """
        results = {"success": 0, "failed": 0}
        
        for email in to_emails:
            success = await EmailService.send_email(email, subject, html_content, plain_text)
            if success:
                results["success"] += 1
            else:
                results["failed"] += 1
        
        return results
    
    @staticmethod
    async def send_alert_email(
        to_email: str,
        patient_name: str,
        alert_type: str,
        alert_message: str,
        vitals_data: Optional[dict] = None
    ) -> bool:
        """
        Send an alert notification email to family members or caregivers.
        
        Args:
            to_email: Recipient email address
            patient_name: Name of the patient
            alert_type: Type of alert (critical, warning, info)
            alert_message: Alert message
            vitals_data: Optional vital signs data
            
        Returns:
            True if email sent successfully
        """
        subject = f"⚠️ HyperWatch Alert: {alert_type.upper()} - {patient_name}"
        
        # Create HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: {'#dc2626' if alert_type == 'critical' else '#ea580c' if alert_type == 'warning' else '#2563eb'}; 
                           color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }}
                .alert-box {{ background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid {'#dc2626' if alert_type == 'critical' else '#ea580c'}; }}
                .vitals {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 6px; }}
                .vitals-item {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }}
                .button {{ display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; 
                          text-decoration: none; border-radius: 6px; margin: 10px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏥 HyperWatch Alert</h1>
                    <p>Blood Pressure Monitoring System</p>
                </div>
                <div class="content">
                    <h2>Alert for {patient_name}</h2>
                    <div class="alert-box">
                        <h3 style="margin-top: 0; color: {'#dc2626' if alert_type == 'critical' else '#ea580c'};">
                            {alert_type.upper()} ALERT
                        </h3>
                        <p>{alert_message}</p>
                    </div>
        """
        
        # Add vitals data if provided
        if vitals_data:
            html_content += """
                    <div class="vitals">
                        <h3 style="margin-top: 0;">Current Vital Signs</h3>
            """
            if "systolic" in vitals_data and "diastolic" in vitals_data:
                html_content += f"""
                        <div class="vitals-item">
                            <span><strong>Blood Pressure:</strong></span>
                            <span>{vitals_data['systolic']}/{vitals_data['diastolic']} mmHg</span>
                        </div>
                """
            if "heart_rate" in vitals_data:
                html_content += f"""
                        <div class="vitals-item">
                            <span><strong>Heart Rate:</strong></span>
                            <span>{vitals_data['heart_rate']} bpm</span>
                        </div>
                """
            if "measured_at" in vitals_data:
                html_content += f"""
                        <div class="vitals-item">
                            <span><strong>Time:</strong></span>
                            <span>{vitals_data['measured_at']}</span>
                        </div>
                """
            html_content += """
                    </div>
            """
        
        html_content += f"""
                    <p style="margin-top: 20px;">
                        <a href="{settings.FRONTEND_URL}/caregiver/dashboard" class="button">
                            View Dashboard
                        </a>
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        <strong>What to do:</strong><br>
                        {'⚠️ This is a CRITICAL alert. Please contact the patient immediately or seek medical attention.' if alert_type == 'critical' else 
                         '⚠️ Please monitor the patient closely and check in with them.' if alert_type == 'warning' else
                         'ℹ️ This is an informational alert. No immediate action required.'}
                    </p>
                </div>
                <div class="footer">
                    <p>This is an automated alert from HyperWatch Blood Pressure Monitoring System.</p>
                    <p>If you have concerns about these alerts, please contact your healthcare provider.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        plain_text = f"""
        HyperWatch Alert - {alert_type.upper()}
        
        Patient: {patient_name}
        Alert Type: {alert_type}
        
        Message: {alert_message}
        """
        
        if vitals_data:
            plain_text += "\n\nVital Signs:\n"
            if "systolic" in vitals_data and "diastolic" in vitals_data:
                plain_text += f"Blood Pressure: {vitals_data['systolic']}/{vitals_data['diastolic']} mmHg\n"
            if "heart_rate" in vitals_data:
                plain_text += f"Heart Rate: {vitals_data['heart_rate']} bpm\n"
        
        return await EmailService.send_email(to_email, subject, html_content, plain_text)
    
    @staticmethod
    async def send_password_reset_email(
        to_email: str,
        user_name: str,
        reset_token: str
    ) -> bool:
        """
        Send password reset email.
        
        Args:
            to_email: Recipient email address
            user_name: User's name
            reset_token: Password reset token
            
        Returns:
            True if email sent successfully
        """
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        subject = "HyperWatch - Password Reset Request"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #000; 
                }}
                .container {{ 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                }}
                .header {{ 
                    background-color: #2563eb; 
                    color: white; 
                    padding: 20px; 
                    text-align: center; 
                }}
                .content {{ 
                    background-color: #f9fafb; 
                    padding: 20px; 
                }}
                .reset-box {{
                    background-color: #e5e7eb;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 20px 0;
                    text-align: center;
                }}
                .reset-box a {{
                    color: #000 !important;
                    font-weight: bold;
                    word-break: break-all;
                    text-decoration: none;
                }}
                .button {{ 
                    display: inline-block; 
                    padding: 12px 24px; 
                    background-color: #2563eb; 
                    color: white !important; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    margin: 20px 0; 
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello {user_name},</p>

                    <p>
                        We received a request to reset your password for your HyperWatch account.
                    </p>

                    <p>Please use the button or link below to reset your password:</p>

                    <p style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </p>

                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_text = f"""
        Password Reset Request
        
        Hello {user_name},
        
        We received a request to reset your password.
        Click the link below to reset your password:
        
        {reset_link}
        
        If you didn't request this, you can safely ignore this email.
        This link will expire in 1 hour.
        """
        
        return await EmailService.send_email(to_email, subject, html_content, plain_text)
    
    @staticmethod
    async def send_welcome_email(
        to_email: str,
        user_name: str,
        role: str
    ) -> bool:
        """
        Send welcome email to new users.
        
        Args:
            to_email: Recipient email address
            user_name: User's name
            role: User's role
            
        Returns:
            True if email sent successfully
        """
        subject = "Welcome to HyperWatch!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9fafb; padding: 20px; }}
                .button {{ display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                          color: white; text-decoration: none; border-radius: 6px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏥 Welcome to HyperWatch!</h1>
                </div>
                <div class="content">
                    <p>Hello {user_name},</p>
                    <p>Welcome to HyperWatch Blood Pressure Monitoring System!</p>
                    <p>Your account has been successfully created as a <strong>{role}</strong>.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Monitor your blood pressure in real-time</li>
                        <li>Receive instant alerts for abnormal readings</li>
                        <li>Track your health trends over time</li>
                        <li>Share data with healthcare providers</li>
                    </ul>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="{settings.FRONTEND_URL}/login" class="button">Get Started</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_text = f"""
        Welcome to HyperWatch!
        
        Hello {user_name},
        
        Your account has been successfully created as a {role}.
        
        You can now monitor your blood pressure and receive instant alerts.
        
        Login at: {settings.FRONTEND_URL}/login
        """
        
        return await EmailService.send_email(to_email, subject, html_content, plain_text)


# Create a singleton instance
email_service = EmailService()
