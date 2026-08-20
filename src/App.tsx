/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';
import Documentation from './components/Documentation';
import { UIProvider } from './UIContext';

export type ScreenId = '1' | '2' | '3' | '4' | '5' | '6' | '6a';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('1');
  const [currentTab, setCurrentTab] = useState<string>('workspace');

  const navigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setCurrentTab('workspace');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'documentation') {
      setCurrentTab('documentation');
    } else if (tab === 'workspace') {
      setCurrentTab('workspace');
    }
  };

  return (
    <UIProvider>
      <div className="min-h-screen w-full flex flex-col bg-composer-light font-sans text-gray-900">
        {currentTab === 'documentation' ? (
          <Documentation onTabChange={handleTabChange} />
        ) : (
          <>
            {currentScreen === '1' && <Screen1 onNext={() => navigate('2')} />}
            {currentScreen === '2' && <Screen2 onNext={() => navigate('3')} onTabChange={handleTabChange} />}
            {currentScreen === '3' && <Screen3 onNext={() => navigate('5')} onTabChange={handleTabChange} />}
            {currentScreen === '4' && <Screen4 onNext={() => navigate('5')} onTabChange={handleTabChange} />}
            {currentScreen === '5' && <Screen5 onNext={() => navigate('6')} onTabChange={handleTabChange} />}
            {(currentScreen === '6' || currentScreen === '6a') && (
              <Screen6 currentScreen={currentScreen} onNavigate={navigate} onTabChange={handleTabChange} />
            )}
          </>
        )}
      </div>
    </UIProvider>
  );
}
