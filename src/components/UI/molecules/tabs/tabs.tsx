import { Button, Icon } from "@components/UI/atoms";
import { Tab } from "@components/UI/molecules";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import { type ITab } from "../tab/tab.tsx";

interface TabsProps {
  initialTabs?: Array<ITab>;
  initialActiveTab?: string;
  onChange?: (activeTab: string) => void;
  onNewTab?: (id: string) => void;
  onTabClose?: (id: string) => void;
}

export default function Tabs({
  initialTabs,
  onChange,
  onNewTab,
  onTabClose,
  initialActiveTab,
}: TabsProps) {
  const [tabs, setTabs] = useState(initialTabs ?? [{ id: v4(), title: "" }]);
  const [activeTab, setActiveTab] = useState(
    initialActiveTab ?? (tabs?.[0]?.id || "")
  );

  useEffect(() => {
    onChange?.(activeTab);
    if (tabsRef.current) {
      tabsRef.current.scrollTo({
        left: tabsRef.current.scrollWidth,
        behavior: "smooth",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTab]);

  const tabsRef = useRef<HTMLDivElement>(null);

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
            const filteredTabs = tabs.filter(({ id }) => id !== tab.id);
            setTabs(filteredTabs);
            if (activeTab === tab.id) {
              setActiveTab(filteredTabs[index - 1]?.id ?? tabs?.[0]?.id);
            }
          }}
          onDoubleClick={(title) => {
            tab.title = title;
            setTabs([...tabs]);
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
            const newTab = { id: v4(), title: "" };
            setTabs([...tabs, newTab]);
            setActiveTab(newTab.id);
            onNewTab?.(newTab.id);
          }}
        >
          <Icon name="add" className="text-titlebar" />
        </Button>
      </div>
    </div>
  );
}
