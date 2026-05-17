import React from 'react'
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import ClubCard from '../LayoutUI/ClubsUI/Card';

const Clubs = () => {
  const contentData = [
    { 
        id: 1, 
        title: "The Technocracy", 
        summary: "The official Technical Committee, organizing technical events and the annual technical fest AAVARTAN.", 
        tag: "Technical" 
    },
    { 
        id: 2, 
        title: "SAHYOG - The Mentorship Club", 
        summary: "Provides constructive guidance, runs the Green Library textbook initiative, and organizes mock placement sessions.", 
        tag: "Societal/Mentorship" 
    },
    { 
        id: 3, 
        title: "Raaga – The Music Club", 
        summary: "Dedicated to fostering musical talent, organizing performances, and hosting the annual music event SHRUTI.", 
        tag: "Cultural" 
    },
    { 
        id: 4, 
        title: "ROBOTix Club", 
        summary: "Focuses on automation, design, and programming, conducting workshops and robotics competitions.", 
        tag: "Technical" 
    },
    { 
        id: 5, 
        title: "Literati - The Literature Club", 
        summary: "Improves communication skills by hosting debates, public speaking sessions, quizzes, and literary contests.", 
        tag: "Literary" 
    },

    { 
        id: 6, 
        title: "KALI - The AI Club", 
        summary: "An upcoming club focused on Artificial Intelligence, Machine Learning, and Neural Networks, driving innovation in data science.", 
        tag: "Unofficial/Upcoming" 
    },
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