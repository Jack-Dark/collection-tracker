import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { createColumnHelper } from '@tanstack/react-table';

import type { TablePropsDef, TableFeaturesDef } from '#/components/Table';

import { Table } from '#/components/Table';

type MockTableDataRowDef = {
  location: string;
  name: string;
};

const columnHelper = createColumnHelper<
  TableFeaturesDef,
  MockTableDataRowDef
>();

const columns = [
  columnHelper.accessor('name', {
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('location', {
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
    header: 'Location',
  }),
];

const data: MockTableDataRowDef[] = [
  {
    location: 'Seattle, WA',
    name: 'Row 1',
  },
  {
    location: 'Austin, TX',
    name: 'Row 2',
  },
  {
    location: 'Denver, CO',
    name: 'Row 3',
  },
  {
    location: 'Phoenix, AZ',
    name: 'Row 4',
  },
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/arg-types#argtypes
  argTypes: {},
  component: Table,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  title: 'Example/Table',
} satisfies Meta<
  TablePropsDef<TableFeaturesDef, MockTableDataRowDef, string, {}>
>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    columns: columns as Story['args']['columns'],
    data,
  },
};
