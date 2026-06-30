const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.37-.82-.6-1.5-1.4-1.97-2.3-.08 3.52 0 7.05-.06 10.56-.13 2.16-.99 4.32-2.71 5.62-1.74 1.35-4.11 1.77-6.26 1.33-2.31-.44-4.42-2.11-5.18-4.36-.85-2.43-.37-5.32 1.35-7.16 1.33-1.48 3.41-2.28 5.4-2.1v4.07c-1.12-.13-2.34.18-3.08 1.05-.72.82-.77 2.13-.24 3.09.58 1.09 1.87 1.74 3.09 1.57 1.34-.14 2.45-1.32 2.49-2.67.06-4.66.03-9.32.05-13.98z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';

interface SocialLink {
  href: string;
  label: string;
  platform: SocialPlatform;
}

const platformStyles: Record<SocialPlatform, string> = {
  facebook:
    'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#60A5FA] border-[#1877F2]/20',
  instagram:
    'bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] dark:text-[#F43F5E] border-[#E1306C]/20',
  tiktok:
    'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-900 dark:text-white border-gray-900/10 dark:border-white/10',
  linkedin:
    'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#38BDF8] border-[#0A66C2]/20',
};

const platformIcons: Record<SocialPlatform, () => JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
};

const socialLinks: SocialLink[] = [
  {
    href: 'https://www.facebook.com/MoraSpirit?mibextid=wwXIfr&mibextid=wwXIfr',
    label: 'MoraSpirit',
    platform: 'facebook',
  },

  {
    href: 'https://www.instagram.com/moraspirit_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    label: 'Instagram',
    platform: 'instagram',
  },
];

export default function SocialLinks() {
  return (
    <div className="w-full max-w-md z-10 mt-8 sm:mt-6 mb-6 px-1">
      <p className="text-[10px] font-mono tracking-widest text-white/50 uppercase text-center mb-3">
        Follow Us
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {socialLinks.map((link) => {
          const Icon = platformIcons[link.platform];
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm hover:scale-[1.03] ${platformStyles[link.platform]}`}
            >
              <Icon />
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
