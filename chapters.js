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
    },
    {
        id: "chapter2",
        title: "Chapter 2: Core Components of RAG",
        description: "Deep dive into Phase 1 — Document Ingestion: loading data sources, chunking with overlap, generating embeddings, and storing vectors in FAISS, ChromaDB, Pinecone, and more.",
        children: [
            {
                id: "chapter2-1",
                title: "Phase 2 & 3: Query Processing and Generation",
                description: "How a user query becomes a grounded, cited answer — embedding the query, similarity search (cosine vs Euclidean), context augmentation, LLM selection, and the complete end-to-end flow."
            }
        ]
    },
    {
        id: "chapter3",
        title: "Chapter 3: Data Ingestion & Parsing",
        description: "Turning raw files into searchable Documents — the LangChain Document object, text/PDF/Word/CSV/Excel/JSON/SQL loaders, text-splitting strategies, artifact cleaning, and metadata enrichment, with code and sample data."
    },
    {
        id: "chapter4",
        title: "Chapter 4: Vector Embeddings & Vector Databases",
        description: "How text becomes numbers — embeddings that capture meaning, cosine similarity, the movie/Netflix feature analogy, HuggingFace vs OpenAI embedding models, batch embeddings, and building semantic search."
    }
];
