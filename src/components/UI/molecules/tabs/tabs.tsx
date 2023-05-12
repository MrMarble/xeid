import { Button, Icon } from "@components/UI/atoms";
import { Tab } from "@components/UI/molecules";
import { fs } from "@tauri-apps/api";
import { useEffect, useRef } from "react";
import { v4 } from "uuid";

import { useRunStore } from "@/store/store";

export default function Tabs() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const { tabs, activeTab, addTab, setActiveTab, removeTab, renameTab } =
    useRunStore((state) => ({
      tabs: state.tabs,
      activeTab: state.activeTab,
      addTab: state.addTab,
      setActiveTab: state.setActiveTab,
      removeTab: state.removeTab,
      renameTab: state.renameTab,
    }));

  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.scrollTo({
        left: tabsRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    const tabsElement = tabsRef?.current;
    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      if (!tabsElement) return;

      tabsElement.scrollLeft += event.deltaY || event.deltaX;
    };

    if (tabsElement) {
      tabsElement.addEventListener("wheel", wheelHandler);
    }

    return () => {
      tabsElement?.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  return (
    <div ref={tabsRef} className="flex w-full scrollbar" data-tauri-drag-region>
      {tabs.map((tab, index) => (
        <Tab
          id={tab.id}
          key={tab.id}
          title={tab.title}
          active={activeTab === tab.id}
          onClick={() => {
            setActiveTab(tab.id);
          }}
          onClose={() => {
            removeTab(tab.id);
            if (activeTab === tab.id) {
              const filteredTabs = tabs.filter(({ id }) => id !== tab.id);
              setActiveTab(filteredTabs[index - 1]?.id ?? tabs?.[0]?.id);
            }
            fs.removeFile(tab.id, { dir: fs.BaseDirectory.AppData }).catch(
              console.error
            );
          }}
          onDoubleClick={(title) => {
            renameTab(tab.id, title);
          }}
          canClose={tabs.length > 1}
        />
      ))}
      <div
        className="flex-grow border-b border-l border-border"
        data-tauri-drag-region
      >
        <Button
          className="h-full px-2 py-0"
          onClick={() => {
            const newTab = v4();
            addTab(newTab);
            setActiveTab(newTab);
          }}
        >
          <Icon name="add" className="text-titlebar" />
        </Button>
      </div>
    </div>
  );
}
