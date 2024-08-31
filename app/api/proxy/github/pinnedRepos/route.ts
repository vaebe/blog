import { NextResponse } from 'next/server';

export async function GET() {
  const query = `
  {
    user(login: "${process.env.NEXT_PUBLIC_GITHUB_USER_NAME}") {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        totalCount
        edges {
          node {
            ... on Repository {
              id
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name,
                color
              }
            }
          }
        }
      }
    }
  }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }).then(res => res.json())

    const list = response?.data?.user?.pinnedItems?.edges?.map((edge: any) => edge.node) || [];

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `获取 github 仓库信息失败:${error}`}, { status: 500 });
  }
}