const buttonVariants = {
  default: 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-primary text-white shadow-sm shadow-black/5 hover:bg-primary/90 h-9 px-4 py-2',
  secondary: 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80 h-9 w-9 rounded-full',
};

class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.variant = this.getAttribute('variant') || 'default';
    this.href = this.getAttribute('href') || '#';
    this.innerHTML = `
      <style>
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          cursor: pointer;
        }
        .button svg {
          pointer-events: none;
          flex-shrink: 0;
        }
      </style>
      <a href="${this.href}" class="button ${buttonVariants[this.variant]}">
        <slot></slot>
      </a>
    `;
  }
}

customElements.define('custom-button', CustomButton);
