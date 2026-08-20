import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  showSpendingInsights: boolean;
  setShowSpendingInsights: (show: boolean) => void;
  showRecentTransactions: boolean;
  setShowRecentTransactions: (show: boolean) => void;
  showBalanceCard: boolean;
  setShowBalanceCard: (show: boolean) => void;
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
  showBottomNav: boolean;
  setShowBottomNav: (show: boolean) => void;
  greetingText: string;
  setGreetingText: (text: string) => void;
  balanceLabel: string;
  setBalanceLabel: (text: string) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  institutionName: string;
  setInstitutionName: (name: string) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  fontFamily: 'sans' | 'serif' | 'mono';
  setFontFamily: (font: 'sans' | 'serif' | 'mono') => void;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  setBorderRadius: (radius: 'none' | 'sm' | 'md' | 'lg' | 'full') => void;
  cardStyle: 'flat' | 'shadow' | 'bordered';
  setCardStyle: (style: 'flat' | 'shadow' | 'bordered') => void;
  headerStyle: 'default' | 'minimal' | 'prominent';
  setHeaderStyle: (style: 'default' | 'minimal' | 'prominent') => void;
  layoutStyle: 'default' | 'compact' | 'spacious';
  setLayoutStyle: (style: 'default' | 'compact' | 'spacious') => void;
  prototypeTemplate: 'standard' | 'loan-origination' | 'account-opening' | 'financial-wellness';
  setPrototypeTemplate: (template: 'standard' | 'loan-origination' | 'account-opening' | 'financial-wellness') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [showSpendingInsights, setShowSpendingInsights] = useState(true);
  const [showRecentTransactions, setShowRecentTransactions] = useState(true);
  const [showBalanceCard, setShowBalanceCard] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [greetingText, setGreetingText] = useState('Welcome back');
  const [balanceLabel, setBalanceLabel] = useState('Total Balance');
  const [themeColor, setThemeColor] = useState('#2d5f3f');
  const [accentColor, setAccentColor] = useState('#d4a574');
  const [institutionName, setInstitutionName] = useState('Cascade');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [borderRadius, setBorderRadius] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>('xl' as any); // using xl as default for now, mapped to lg
  const [cardStyle, setCardStyle] = useState<'flat' | 'shadow' | 'bordered'>('shadow');
  const [headerStyle, setHeaderStyle] = useState<'default' | 'minimal' | 'prominent'>('default');
  const [layoutStyle, setLayoutStyle] = useState<'default' | 'compact' | 'spacious'>('default');
  const [prototypeTemplate, setPrototypeTemplate] = useState<'standard' | 'loan-origination' | 'account-opening' | 'financial-wellness'>('standard');

  return (
    <UIContext.Provider value={{
      showSpendingInsights, setShowSpendingInsights,
      showRecentTransactions, setShowRecentTransactions,
      showBalanceCard, setShowBalanceCard,
      showQuickActions, setShowQuickActions,
      showBottomNav, setShowBottomNav,
      greetingText, setGreetingText,
      balanceLabel, setBalanceLabel,
      themeColor, setThemeColor,
      accentColor, setAccentColor,
      institutionName, setInstitutionName,
      logoUrl, setLogoUrl,
      fontFamily, setFontFamily,
      borderRadius, setBorderRadius,
      cardStyle, setCardStyle,
      headerStyle, setHeaderStyle,
      layoutStyle, setLayoutStyle,
      prototypeTemplate, setPrototypeTemplate
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
