import { Globe, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-16 bg-surface-container-low font-sans text-sm tracking-wide">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-12 max-w-[1440px] mx-auto">
        <div className="space-y-4 text-center md:text-left">
          <div className="font-headline font-bold text-on-surface text-xl">Sanctuary AI</div>
          <p className="text-on-surface-variant">© 2024 Sanctuary AI. Embodied Peace.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <a className="text-on-surface-variant hover:text-primary underline underline-offset-8 transition-colors duration-300" href="#">Privacy</a>
          <a className="text-on-surface-variant hover:text-primary underline underline-offset-8 transition-colors duration-300" href="#">Terms</a>
          <a className="text-on-surface-variant hover:text-primary underline underline-offset-8 transition-colors duration-300" href="#">Research</a>
          <a className="text-on-surface-variant hover:text-primary underline underline-offset-8 transition-colors duration-300" href="#">Contact</a>
        </div>

        <div className="flex space-x-6">
          <Globe className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors duration-300" />
          <Share2 className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors duration-300" />
        </div>
      </div>
    </footer>
  );
}
