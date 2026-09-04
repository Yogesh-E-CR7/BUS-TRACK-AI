/**
 * BusTrack AI - Authentication & Role Guard System
 * Prototype Authentication & Role Access Enforcer
 * 
 * SECURITY NOTE:
 * Prototype authentication only. Production deployment must use secure backend authentication,
 * password hashing and secure session/token management.
 */

const AuthManager = (() => {
  const USERS_KEY = 'busTrackUsers';
  const CURRENT_USER_KEY = 'loggedInUser';
  const USER_ROLE_KEY = 'userRole';
  const USER_NAME_KEY = 'userName';
  const USER_EMAIL_KEY = 'userEmail';
  const USER_ID_KEY = 'userId';

  // Seed standard demo prototype accounts (supporting both email and legacy demo username login)
  const DEFAULT_USERS = [
    {
      id: 'USR-1001',
      username: 'passenger001',
      email: 'priya@bustrack.ai',
      password: 'passenger123',
      role: 'passenger',
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      city: 'Coimbatore',
      language: 'en',
      createdAt: '2026-01-15T09:00:00.000Z'
    },
    {
      id: 'DRV-1002',
      username: 'driver001',
      email: 'driver001@bustrack.ai',
      password: 'driver123',
      role: 'driver',
      name: 'Murugan K.',
      phone: '+91 98765 11223',
      city: 'Coimbatore',
      language: 'ta',
      createdAt: '2026-01-10T08:30:00.000Z'
    },
    {
      id: 'ADM-1003',
      username: 'admin001',
      email: 'karthik.admin@bustrack.ai',
      password: 'admin123',
      role: 'admin',
      name: 'Karthik Raman',
      phone: '+91 98765 33445',
      city: 'Chennai',
      language: 'en',
      createdAt: '2026-01-01T10:00:00.000Z'
    },
    {
      id: 'MIN-1004',
      username: 'minister001',
      email: 'minister@transport.gov.in',
      password: 'minister123',
      role: 'minister',
      name: 'Hon. Transport Minister',
      phone: '+91 98765 99999',
      city: 'State HQ',
      language: 'ta',
      createdAt: '2025-12-01T09:00:00.000Z'
    }
  ];

  const initUsers = () => {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    } else {
      // Ensure default demo users exist if list is partially corrupted
      try {
        const parsed = JSON.parse(existing);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
        }
      } catch (e) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      }
    }
  };

  const getUsers = () => {
    initUsers();
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      return DEFAULT_USERS;
    }
  };

  /**
   * Password strength evaluator
   * Requirements:
   * - Min 8 characters
   * - One uppercase letter
   * - One lowercase letter
   * - One number
   * - One special character
   */
  const validatePasswordRequirements = (password) => {
    if (!password || typeof password !== 'string') return false;
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'Weak', percent: 0, color: '#f87171' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 4) {
      return { score: 1, label: 'Weak', percent: 33, color: '#f87171' };
    } else if (score < 6) {
      return { score: 2, label: 'Medium', percent: 66, color: '#fbbf24' };
    } else {
      return { score: 3, label: 'Strong', percent: 100, color: '#34d399' };
    }
  };

  /**
   * Login function - Supports Email Address as primary Login ID
   * Also retains demo credentials fallback (username/email)
   */
  const login = (identifier, password) => {
    initUsers();
    if (!identifier || !password) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const users = getUsers();

    // Match by email (primary) or legacy username (for demo switches)
    const user = users.find(u => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanIdentifier;
      const matchUser = u.username && u.username.toLowerCase() === cleanIdentifier;
      return (matchEmail || matchUser) && u.password === password;
    });

    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.email || user.username);
      localStorage.setItem(USER_ROLE_KEY, user.role);
      localStorage.setItem(USER_NAME_KEY, user.name);
      localStorage.setItem(USER_EMAIL_KEY, user.email || '');
      localStorage.setItem(USER_ID_KEY, user.id || 'USR-' + Math.floor(1000 + Math.random() * 9000));
      
      return { success: true, user };
    }

    // Generic error message - do not reveal whether the email exists
    return { success: false, message: 'Invalid email or password.' };
  };

  /**
   * Public Registration - Strictly PASSENGER accounts only
   */
  const register = (userData) => {
    initUsers();
    
    // Validate required fields
    if (!userData.name || !userData.name.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!userData.email || !userData.email.trim() || !/^\S+@\S+\.\S+$/.test(userData.email.trim())) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!validatePasswordRequirements(userData.password)) {
      return { 
        success: false, 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and a special character.' 
      };
    }
    if (userData.password !== userData.confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    const users = getUsers();

    // Check duplicate email (case-insensitive)
    const exists = users.some(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { 
        success: false, 
        code: 'DUPLICATE_EMAIL', 
        message: 'This email is already registered.' 
      };
    }

    // Generate unique User ID
    const newId = 'USR-' + (Date.now().toString().slice(-4) + Math.floor(100 + Math.random() * 900));

    // Every public account is strictly a passenger
    const newAccount = {
      id: newId,
      username: cleanEmail, // Email is the login ID
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: 'passenger', // Strictly passenger
      phone: (userData.phone || '').trim() || 'Not Provided',
      city: (userData.city || '').trim() || 'Coimbatore',
      language: userData.language || 'en',
      createdAt: new Date().toISOString()
    };

    users.push(newAccount);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { 
      success: true, 
      user: {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
        createdAt: newAccount.createdAt
      }
    };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ID_KEY);
    window.location.href = 'login.html';
  };

  const getCurrentUser = () => {
    initUsers();
    const identifier = localStorage.getItem(CURRENT_USER_KEY);
    if (!identifier) return null;
    
    const users = getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) || 
      (u.username && u.username.toLowerCase() === cleanId)
    );

    if (user) return user;

    return {
      id: localStorage.getItem(USER_ID_KEY) || 'USR-001',
      username: identifier,
      email: localStorage.getItem(USER_EMAIL_KEY) || identifier,
      role: localStorage.getItem(USER_ROLE_KEY) || 'passenger',
      name: localStorage.getItem(USER_NAME_KEY) || 'Passenger',
      phone: '+91 98765 43210',
      city: 'Coimbatore',
      language: 'en',
      createdAt: '2026-01-15T09:00:00.000Z'
    };
  };

  const getRoleLandingPage = (role) => {
    switch (role) {
      case 'driver': return 'driver.html';
      case 'admin': return 'admin.html';
      case 'minister': return 'minister.html';
      case 'passenger':
      default: return 'passenger.html';
    }
  };

  /**
   * Enforces role protection on HTML pages.
   * If not logged in or role unauthorized, redirects to login.html
   */
  const enforceRoleProtection = (allowedRoles = []) => {
    initUsers();
    const user = getCurrentUser();
    const currentPath = window.location.pathname;
    const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    // Public pages
    if (filename === 'index.html' || filename === 'login.html' || filename === 'register.html' || filename === '') {
      return;
    }

    if (!user) {
      // User is not logged in
      window.location.href = `login.html?redirect=${encodeURIComponent(filename)}`;
      return;
    }

    // Role check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Access Restricted: This dashboard is reserved for ${allowedRoles.join('/')} users. Redirecting to your authorized home.`);
      window.location.href = getRoleLandingPage(user.role);
    }
  };

  // Run on script load
  initUsers();

  return {
    login,
    register,
    logout,
    getCurrentUser,
    getUsers,
    getRoleLandingPage,
    enforceRoleProtection,
    checkPasswordStrength,
    validatePasswordRequirements,
    DEFAULT_USERS
  };
})();

window.AuthManager = AuthManager;
