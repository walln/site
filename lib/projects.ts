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
    }
  ];
}
