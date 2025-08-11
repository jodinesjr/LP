class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Parse the data attributes
    const brandName = this.getAttribute('brand-name') || 'Harpio';
    const year = new Date().getFullYear();
    
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          padding: 4rem 0 1.5rem;
          width: 100%;
          background-color: #fff;
          border-top: 1px solid #e5e7eb;
        }
        .container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .top-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .top-section {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.25rem;
          color: #111827;
        }
        .social-links {
          display: flex;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .divider {
          border-top: 1px solid #e5e7eb;
          margin: 1.5rem 0;
        }
        .bottom-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .bottom-section {
            display: grid;
            grid-template-columns: repeat(10, minmax(0, 1fr));
            gap: 0;
          }
        }
        .nav-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .nav-links a {
          color: #4f46e5;
          text-decoration: none;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .nav-links a:hover {
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .legal-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
          list-style: none;
          padding: 0;
          margin: 1.5rem 0 0 0;
        }
        @media (min-width: 1024px) {
          .legal-links {
            margin: 0;
            justify-content: flex-end;
          }
        }
        .legal-links a {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .legal-links a:hover {
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .copyright {
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: #6b7280;
          white-space: nowrap;
          margin-top: 1.5rem;
        }
        @media (min-width: 1024px) {
          .nav-section {
            grid-column: span 7 / span 7;
            margin-left: auto;
          }
          .legal-section {
            grid-column: span 7 / span 7;
            margin-left: auto;
          }
          .copyright {
            grid-row: span 2 / span 2;
            margin-top: 0;
          }
        }
      </style>

      <div class="container">
        <div class="top-section">
          <a href="/" class="brand" aria-label="${brandName}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/>
            </svg>
            <span>${brandName}</span>
          </a>
          <ul class="social-links">
            <li>
              <a href="https://twitter.com/harpiotech" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://github.com/harpiotech" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/company/harpiotech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="divider"></div>
        
        <div class="bottom-section">
          <div class="copyright">
            <div>© ${year} ${brandName}</div>
            <div>Todos os direitos reservados</div>
          </div>
          
          <div class="nav-section">
            <ul class="nav-links">
              <li><a href="#">Produtos</a></li>
              <li><a href="#">Soluções</a></li>
              <li><a href="#">Preços</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>
          
          <div class="legal-section">
            <ul class="legal-links">
              <li><a href="#">Termos de Serviço</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);
