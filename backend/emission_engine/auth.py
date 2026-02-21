"""
auth.py - Authentication and JWT token handling for CarbonChain Pro

Handles company authentication, token generation, and verification
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import secrets
import hashlib
from enum import Enum

# In production, use: from jose import JWTError, jwt

class TokenType(Enum):
    """Token types"""
    ACCESS = "access"
    REFRESH = "refresh"


class CompanyAuth:
    """Handle company authentication"""
    
    # In production, move these to environment variables
    SECRET_KEY = "jwtsecret"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash password using SHA256
        
        Args:
            password: Plain text password
            
        Returns:
            str: Hashed password
        """
        return hashlib.sha256(password.encode()).hexdigest()
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify password against hash
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Stored hash
            
        Returns:
            bool: True if passwords match
        """
        return CompanyAuth.hash_password(plain_password) == hashed_password
    
    @staticmethod
    def generate_token(company_id: str, token_type: TokenType = TokenType.ACCESS) -> str:
        """
        Generate JWT token (simplified version)
        
        Args:
            company_id: Company ObjectId
            token_type: Type of token (access or refresh)
            
        Returns:
            str: JWT token
        """
        # In production: Use PyJWT library
        # payload = {
        #     "sub": str(company_id),
        #     "type": token_type.value,
        #     "iat": datetime.utcnow(),
        #     "exp": datetime.utcnow() + timedelta(
        #         minutes=CompanyAuth.ACCESS_TOKEN_EXPIRE_MINUTES
        #         if token_type == TokenType.ACCESS
                #         else CompanyAuth.REFRESH_TOKEN_EXPIRE_DAYS
        #     )
        # }
        # return jwt.encode(payload, CompanyAuth.SECRET_KEY, algorithm=CompanyAuth.ALGORITHM)
        
        # For now, return a mock token
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token to verify
            
        Returns:
            dict: Token payload if valid, None if invalid
        """
        # In production: Use PyJWT library
        # try:
        #     payload = jwt.decode(token, CompanyAuth.SECRET_KEY, algorithms=[CompanyAuth.ALGORITHM])
        #     return payload
        # except JWTError:
        #     return None
        
        # For now, return mock verification
        return {"sub": token, "type": "access"}


class SessionManager:
    """Manage company sessions"""
    
    # In-memory session storage (in production, use Redis)
    _sessions = {}
    
    @staticmethod
    def create_session(company_id: str, company_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new session for a company
        
        Args:
            company_id: Company ObjectId
            company_data: Company information
            
        Returns:
            dict: Session data with tokens
        """
        session_id = secrets.token_urlsafe(32)
        access_token = CompanyAuth.generate_token(company_id, TokenType.ACCESS)
        refresh_token = CompanyAuth.generate_token(company_id, TokenType.REFRESH)
        
        session = {
            "sessionId": session_id,
            "companyId": company_id,
            "companyName": company_data.get("name"),
            "email": company_data.get("email"),
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "createdAt": datetime.utcnow().isoformat(),
            "expiresAt": (datetime.utcnow() + timedelta(
                minutes=CompanyAuth.ACCESS_TOKEN_EXPIRE_MINUTES
            )).isoformat()
        }
        
        # In production: Store in Redis
        SessionManager._sessions[session_id] = session
        
        return session
    
    @staticmethod
    def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify access token and return company info
        
        Args:
            token: Access token
            
        Returns:
            dict: Company session data or None if invalid
        """
        # In production: Verify JWT and query session store
        # For now, mock verification
        for session in SessionManager._sessions.values():
            if session.get("accessToken") == token:
                return session
        return None
    
    @staticmethod
    def refresh_session(refresh_token: str) -> Optional[Dict[str, Any]]:
        """
        Refresh an access token
        
        Args:
            refresh_token: Refresh token
            
        Returns:
            dict: New session data or None if invalid
        """
        # Find session with this refresh token
        for session in SessionManager._sessions.values():
            if session.get("refreshToken") == refresh_token:
                # Generate new access token
                new_access_token = CompanyAuth.generate_token(
                    session.get("companyId"), 
                    TokenType.ACCESS
                )
                session["accessToken"] = new_access_token
                session["expiresAt"] = (datetime.utcnow() + timedelta(
                    minutes=CompanyAuth.ACCESS_TOKEN_EXPIRE_MINUTES
                )).isoformat()
                return session
        return None
    
    @staticmethod
    def revoke_session(session_id: str) -> bool:
        """
        Revoke a session (logout)
        
        Args:
            session_id: Session ID to revoke
            
        Returns:
            bool: True if revoked successfully
        """
        if session_id in SessionManager._sessions:
            del SessionManager._sessions[session_id]
            return True
        return False
    
    @staticmethod
    def get_all_sessions(company_id: str) -> list:
        """
        Get all active sessions for a company
        
        Args:
            company_id: Company ID
            
        Returns:
            list: All active sessions for this company
        """
        return [
            session for session in SessionManager._sessions.values()
            if session.get("companyId") == company_id
        ]


class PermissionManager:
    """Manage company permissions and access control"""
    
    # Define company roles and their permissions
    ROLES = {
        "admin": {
            "can_create_product": True,
            "can_edit_product": True,
            "can_delete_product": True,
            "can_view_dashboard": True,
            "can_manage_team": True,
            "can_manage_settings": True,
        },
        "manager": {
            "can_create_product": True,
            "can_edit_product": True,
            "can_delete_product": False,
            "can_view_dashboard": True,
            "can_manage_team": False,
            "can_manage_settings": False,
        },
        "analyst": {
            "can_create_product": False,
            "can_edit_product": False,
            "can_delete_product": False,
            "can_view_dashboard": True,
            "can_manage_team": False,
            "can_manage_settings": False,
        },
    }
    
    @staticmethod
    def has_permission(company_role: str, permission: str) -> bool:
        """
        Check if a role has a specific permission
        
        Args:
            company_role: Company role (admin, manager, analyst)
            permission: Permission to check
            
        Returns:
            bool: True if role has permission
        """
        role_permissions = PermissionManager.ROLES.get(company_role, {})
        return role_permissions.get(permission, False)
    
    @staticmethod
    def check_product_access(company_id: str, product_id: str) -> bool:
        """
        Check if company can access a product
        
        Args:
            company_id: Company ID
            product_id: Product ID
            
        Returns:
            bool: True if company owns the product
        """
        # In production: Query database to check if product belongs to company
        # return db.products.find_one({"_id": ObjectId(product_id), "companyId": ObjectId(company_id)})
        return True
