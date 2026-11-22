import type { ReactNode } from 'react';

import BentoIcon from '@mui/icons-material/Bento';
import DevicesIcon from '@mui/icons-material/Devices';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import InsightsIcon from '@mui/icons-material/Insights';
import { twJoin } from 'tailwind-merge';

import { PageWrapper } from '#/components/PageWrapper';

// TODO - REQUIRED FEATURE: FILL OUT HOMEPAGE
export const HomePage = () => {
  return (
    <PageWrapper>
      <div className="h-full grid gap-10 overflow-y-auto">
        <div className="grid gap-4">
          <h2>Content coming soon!</h2>

          <div
            className={twJoin(
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
            )}
          >
            <HomepageGridItem
              description="Catalog Items Across Any Category"
              icon={<BentoIcon fontSize="inherit" />}
              title="Organize Your Collections"
            />
            <HomepageGridItem
              description="Add custom fields and share them across
                any of your collections"
              icon={<FormatListBulletedAddIcon fontSize="inherit" />}
              title="Track Key Details"
            />
            <HomepageGridItem
              description="Available and editable on any device"
              icon={<DevicesIcon fontSize="inherit" />}
              title="Access Anywhere"
            />
            <HomepageGridItem
              description="Each collection generates statistics based on your input"
              icon={<InsightsIcon fontSize="inherit" />}
              title="View Statistics"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const HomepageGridItem = (props: {
  description: string;
  icon: ReactNode;
  title: string;
}) => {
  const { description, icon, title } = props;

  return (
    <div className="h-full p-10 grid gap-5 justify-center border border-theme-divider-2 rounded-2xl bg-theme-surface-2">
      <div className="flex items-center justify-center">
        <div className="p-4 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-white flex items-center justify-center text-5xl">
          {icon}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-center">{title}</h2>
        <p className="text-center text-theme-t2">{description}</p>
      </div>
    </div>
  );
};
