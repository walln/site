import Container from "../components/Container";

export default function HomePage() {
  return (
    <Container>
      <div className="mx-auto flex max-w-2xl flex-col items-start justify-center border-gray-200 pb-16">
        <div className="flex flex-col-reverse items-start sm:flex-row">
          <div className="flex flex-col pr-8">
            <h1 className="mb-1 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Nick Wall
            </h1>
            <h2 className="mb-8 text-gray-200">
              AI Engineer - Developer - Student
            </h2>
            <p className="mb-4 text-gray-300">
              I am a student, software developer, and artificial intelligence
              research engineer, captivated with exploring the cutting edge of
              technology and pushing the limits of what is possible.
            </p>
            <p className="mb-6 text-gray-100">
              IBM and Southern Methodist University Alumni
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
