
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { languages } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="w-12 h-9 px-2 flex items-center gap-1"
      aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
    >
      <languages className="h-4 w-4" />
      <span className="text-xs font-medium">
        {language === 'en' ? 'AR' : 'EN'}
      </span>
    </Button>
  )
}
