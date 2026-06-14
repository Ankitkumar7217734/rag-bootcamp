/**
 * CHAPTERS CONFIG
 * 
 * To add a new chapter, just add an entry to this array.
 * Each chapter needs:
 *   - id: used in the URL hash and filename (e.g., "chapter1" loads "chapters/chapter1.html")
 *   - title: displayed in sidebar and homepage
 *   - description: short summary for the homepage card
 *   - children (optional): array of sub-chapters with the same structure
 */
const chapters = [
    {
        id: "chapter1",
        title: "Chapter 1: Retrieval-Augmented Generation",
        description: "What is RAG, architecture overview, the three steps, vector databases, the chef analogy, customer support example, and business impact.",
        children: [
            {
                id: "chapter1-1",
                title: "RAG vs Fine-Tuning vs Prompt Engineering",
                description: "Comparing the three main approaches to AI customization."
            }
        ]
    }
];
