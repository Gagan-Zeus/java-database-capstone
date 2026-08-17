function renderFooter() {
    const footer = document.getElementById("footer");
    
    // Check if the container exists before injecting
    if (!footer) return;

    // Inject HTML Content
    footer.innerHTML = `
        <footer class="footer">
            <div class="footer-branding">
                <h3>Smart Clinic</h3>
                <p>&copy; Copyright 2026 Smart Clinic Management System. All rights reserved.</p>
            </div>
            
            <div class="footer-columns-wrapper" style="display: flex; gap: 3rem; flex-wrap: wrap;">
                <div class="footer-column" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <h4 style="color: #0f172a; margin-bottom: 0.25rem;">Company</h4>
                    <a href="#" style="text-decoration: none; color: #64748b;">About</a>
                    <a href="#" style="text-decoration: none; color: #64748b;">Careers</a>
                    <a href="#" style="text-decoration: none; color: #64748b;">Press</a>
                </div>
                
                <div class="footer-column" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <h4 style="color: #0f172a; margin-bottom: 0.25rem;">Support</h4>
                    <a href="#" style="text-decoration: none; color: #64748b;">Account</a>
                    <a href="#" style="text-decoration: none; color: #64748b;">Help Center</a>
                    <a href="#" style="text-decoration: none; color: #64748b;">Contact</a>
                </div>
                
                <div class="footer-column" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <h4 style="color: #0f172a; margin-bottom: 0.25rem;">Legals</h4>
                    <a href="#" style="text-decoration: none; color: #64748b;">Terms</a>
                    <a href="#" style="text-decoration: none; color: #64748b;">Privacy Policy</a>
                    <a href="#" style="text-decoration: none; color: #64748b;">Licensing</a>
                </div>
            </div>
        </footer>
    `;
}

// Call this function at the bottom of the script so it runs automatically
document.addEventListener('DOMContentLoaded', renderFooter);
