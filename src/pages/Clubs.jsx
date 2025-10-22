import React from 'react'
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import ClubCard from '../LayoutUI/ClubsUI/Card';

const Clubs = () => {
  const contentData = [
    { id: 1, title: "Next-Gen AI Insights", summary: "Exploring the latest breakthroughs in large language models and their impact on coding.", tag: "Technology" },
    { id: 2, title: "The Dark Side of UI", summary: "Best practices for designing cohesive and accessible dark-mode user interfaces.", tag: "Design" },
    { id: 3, title: "Appwrite Serverless Functions", summary: "A deep dive into writing and deploying serverless functions with Appwrite.", tag: "Backend" },
    { id: 4, title: "Tailwind CSS Grid Magic", summary: "Mastering responsive layouts using auto-fit and minmax in Tailwind.", tag: "Front-end" },
    // Add more items here...
];
  return (
        <GridPageWrapper minCardWidth={300}>
            {contentData.map((item) => (
                <ClubCard
                    id={item.id}
                    key={item.id}
                    title={item.title}
                    summary={item.summary}
                    tag={item.tag}
                    onView={() => console.log(`Opening: ${item.title}`)}
                />
            ))}
        </GridPageWrapper>
    );
}

export default Clubs