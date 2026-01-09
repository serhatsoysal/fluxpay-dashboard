# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. Do Not Open a Public Issue

Please **DO NOT** create a public GitHub issue for security vulnerabilities. This could put all users at risk.

### 2. Report Privately

Report security vulnerabilities using one of these methods:

#### Option A: GitHub Security Advisories (Preferred)

1. Go to the [Security Advisories page](https://github.com/serhatsoysal/fluxpay-dashboard/security/advisories)
2. Click "New draft security advisory"
3. Fill in the details of the vulnerability
4. Submit the advisory

#### Option B: Email

Send an email to: **security@yourcompany.com**

Include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### 3. What to Expect

After you submit a vulnerability report:

- **Within 48 hours:** We'll acknowledge receipt of your report
- **Within 7 days:** We'll provide an initial assessment and expected timeline
- **Regular updates:** We'll keep you informed as we work on a fix
- **Coordinated disclosure:** We'll work with you to coordinate public disclosure

## Vulnerability Disclosure Process

1. **Report received:** Security team acknowledges receipt
2. **Triage:** We assess the severity and impact
3. **Fix development:** We develop and test a fix
4. **Security advisory:** We create a draft security advisory
5. **Patch release:** We release a patched version
6. **Public disclosure:** We publish the security advisory

## Security Update Notifications

To receive security update notifications:

1. **Watch the repository** on GitHub
2. **Enable security alerts** in your GitHub settings
3. **Subscribe to releases** to get notified of security patches

## Security Best Practices

When using FluxPay Dashboard:

### Environment Variables

- **Never commit** `.env` files to version control
- **Use strong secrets** for JWT_SECRET and API keys
- **Rotate credentials** regularly
- **Use different credentials** for development and production

### Authentication

- **Enable 2FA** for your GitHub account
- **Use strong passwords** for all services
- **Regularly review** active sessions
- **Implement rate limiting** on authentication endpoints

### Dependencies

- **Keep dependencies updated** (Dependabot is enabled)
- **Review security advisories** for dependencies
- **Audit dependencies** regularly using `npm audit`

### Infrastructure

- **Use HTTPS** in production
- **Implement CORS** properly
- **Enable security headers** (CSP, HSTS, etc.)
- **Regular security audits** of your deployment

## Known Security Gaps

We're transparent about current security limitations:

- OAuth2 integration is in development
- Rate limiting needs enhancement
- API request validation could be improved

These items are on our roadmap and will be addressed in future releases.

## Security Tools

This project uses several security tools:

- **Dependabot:** Automated dependency updates
- **CodeQL:** Automated code scanning
- **Trivy:** Vulnerability scanning
- **SonarCloud:** Code quality and security analysis (when configured)

## Scope

This security policy applies to:

- FluxPay Dashboard application code
- Official documentation
- CI/CD pipelines
- Official deployment examples

Out of scope:
- Third-party integrations
- User-deployed instances
- Forks and derivatives

## Credit

We appreciate security researchers who responsibly disclose vulnerabilities. With your permission, we'll credit you in:

- Security advisory
- Release notes
- Project acknowledgments

## Legal

This security policy is provided in good faith. By participating in our vulnerability disclosure program, you agree to:

- Make a good faith effort to avoid privacy violations and data destruction
- Not exploit the vulnerability beyond what's necessary to demonstrate the issue
- Allow us reasonable time to address the issue before public disclosure

## Questions

For questions about this security policy, contact: **security@yourcompany.com**

---

**Last Updated:** January 2026

