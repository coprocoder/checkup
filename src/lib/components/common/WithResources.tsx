import { useMemo } from "react";
import { DefaultRecourse } from "../../types";
import { ResourceHeader } from "./ResourceHeader";
import { ButtonTabProps, ButtonTabs } from "./Tabs";
import useStore from "../../hooks/useStore";
import { Box, useTheme } from "@mui/material";

interface WithResourcesProps {
  renderChildren(resource: DefaultRecourse): React.ReactNode;
}
const WithResources = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, resourceViewMode } = useStore();
  const theme = useTheme();

  if (resourceViewMode === "tabs") {
    return <ResourcesTabTables renderChildren={renderChildren} />;
  } else if (resourceViewMode === "vertical") {
    return (
      <>
        {resources.map((res: DefaultRecourse, i: number) => (
          <Box key={`${res[resourceFields.idField]}_${i}`} sx={{ display: "flex" }}>
            <Box
              sx={{
                borderColor: theme.palette.grey[300],
                borderStyle: "solid",
                borderWidth: "1px 1px 0 1px",
                paddingTop: 1,
                flexBasis: 140,
              }}
            >
              <ResourceHeader resource={res} />
            </Box>
            <Box
              //
              sx={{ width: "100%", overflowX: "auto" }}
            >
              {renderChildren(res)}
            </Box>
          </Box>
        ))}
      </>
    );
  } else {
    return (
      <>
        {resources.map((res: DefaultRecourse, i: number) => (
          <div key={`${res[resourceFields.idField]}_${i}`}>
            <ResourceHeader resource={res} />
            {renderChildren(res)}
          </div>
        ))}
      </>
    );
  }
};

const ResourcesTabTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, selectedResource, handleState } = useStore();

  const tabs: ButtonTabProps[] = resources.map((res) => {
    return {
      id: res[resourceFields.idField],
      label: <ResourceHeader resource={res} />,
      component: <>{renderChildren(res)}</>,
    };
  });

  const setTab = (tab: DefaultRecourse["user_id"]) => {
    handleState(tab, "selectedResource");
  };

  const currentTabSafeId = useMemo(() => {
    const firstId = resources[0][resourceFields.idField];
    if (!selectedResource) {
      return firstId;
    }
    // Make sure current selected id is within the resources array
    const idx = resources.findIndex((re) => re[resourceFields.idField] === selectedResource);
    if (idx < 0) {
      return firstId;
    }

    return selectedResource;
  }, [resources, selectedResource, resourceFields.idField]);

  return (
    <ButtonTabs tabs={tabs} tab={currentTabSafeId} setTab={setTab} style={{ display: "grid" }} />
  );
};

export { WithResources };
