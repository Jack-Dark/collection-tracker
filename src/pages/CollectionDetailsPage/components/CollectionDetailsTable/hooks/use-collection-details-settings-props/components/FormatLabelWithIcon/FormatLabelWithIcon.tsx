import type { PropsWithChildren, JSXElementConstructor } from 'react';

export const FormatLabelWithIcon = (
  props: PropsWithChildren<{ Icon: JSXElementConstructor<{}> }>,
) => {
  const { children, Icon } = props;

  return (
    <div className="grid gap-3 grid-cols-[max-content_1fr] max-w-75">
      <div className="h-full w-6 flex items-center">
        <Icon />
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
};
