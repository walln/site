export default function getProjects() {
  return [
    {
      title: 'GPT Suggest',
      description:
        "Next word prediction using OpenAI's GPT-2. Version 2.0 with Tab-complete is currently in development. *Will be updated to GPT-3 if I ever get beta access.",
      link: 'https://github.com/walln/GPT-Text-Suggestion'
    },
    {
      title: 'Flurry',
      description:
        'Built in go, Flurry was my solution to an API gateway. For a simple application that needed microservices proxied out to different serverless urls, there are not many simple proxies that are easily composable. Flurry is a web proxy designed for easy configuration and plugins for authentication and logging out of the box. New plugins coming soon.',
      link: 'https://github.com/walln/Flurry2'
    },
    {
      title: 'This Website',
      description:
        'This website is built in Next.js using tailwind css and typescript. Next.js allows for this site to implement incremental static genration as well as SSR for upcoming features.',
      link: 'https://github.com/walln/site'
    },
    {
      title: 'Algorithms',
      description: 'Implementations of common algorithms and data structures in python 3.x',
      link: 'https://github.com/walln/algorithms'
    }
  ];
}
