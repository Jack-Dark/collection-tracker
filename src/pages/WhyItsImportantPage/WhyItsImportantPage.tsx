import { PageWrapper } from '#/components/PageWrapper';

// TODO - REQUIRED FEATURE: FILL OUT WHY IT'S IMPORTANT PAGE
export const WhyItsImportantPage = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10 max-w-200">
        <div className="grid gap-4">
          <h2>Why it's Important to track your collections</h2>
          <p>
            The absolute biggest reason is for those worst case scenarios where
            some (or all) of your collection is lost so that you have a complete
            and comprehensive log of everything for insurance. I've seen too
            many examples of folks that spent years building up their collection
            just to suffer a house fire or a break in and suddenly everything is
            gone. If you don't have a full accounting of your collections,
            you're only going to get a fraction of what you're owed by
            insurance.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};
