import { Button } from '#/components/Button';
import { PageWrapper } from '#/components/PageWrapper';
import { githubUrl } from '#/constants/githubUrl';

// TODO - REQUIRED FEATURE: FILL OUT ABOUT PAGE
export const AboutPage = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10 max-w-200">
        <div className="grid gap-4">
          <h2>About the Site</h2>
          <p>
            Collection Tracker was created by a frontend web developer in order
            to practice backend development and learn tools and libraries that
            they hadn't had much - if any - experience with. We won't go into
            technical detail here, but if you're a developer, or you'd just like
            to know more, you can read our thoughts on the project and all the
            libraries and tools that were used on the repo.
          </p>

          <a className="flex" href={githubUrl.readme} target="_blank">
            <Button size="sm" text="View the README" />
          </a>
        </div>
      </div>
    </PageWrapper>
  );
};
