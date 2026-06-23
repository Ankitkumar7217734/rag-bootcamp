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
    },
    {
        id: "chapter5",
        title: "Chapter 5: Vector Storage & Vector Databases",
        description: "Where embeddings live — vector stores vs vector databases, the unified LangChain interface, ChromaDB persistence, FAISS speed, retrievers and search types, managed cloud (Pinecone, Astra DB), and wiring a store into a RAG chain."
    },
    {
        id: "chapter6",
        title: "Chapter 6: Advanced Chunking & Preprocessing — Semantic Chunking",
        description: "Splitting documents by meaning instead of character count — why fixed-size chunking breaks ideas, the five-step semantic chunking algorithm (segment, embed, compare, merge, form chunks), a from-scratch threshold chunker, LangChain's SemanticChunker and its breakpoint types, and plugging semantic chunks into a RAG pipeline."
    },
    {
        id: "chapter7",
        title: "Chapter 7: Hybrid Search Strategies",
        description: "Getting the most out of retrieval — combining dense (embeddings) and sparse (BM25/TF-IDF) search with a weighted hybrid score and EnsembleRetriever, two-stage re-ranking with cross-encoders and LLMs, and MMR for diversity-aware results that balance relevance against redundancy.",
        children: [
            {
                id: "chapter7-1",
                title: "Combining Dense & Sparse Retrieval",
                description: "Fusing keyword search (BM25/TF-IDF, exact matches) with semantic search (embeddings, meaning) via the weighted hybrid score and LangChain's EnsembleRetriever."
            },
            {
                id: "chapter7-2",
                title: "Re-Ranking Techniques",
                description: "The two-stage pattern — a fast retriever fetches a shortlist, then a slow, accurate cross-encoder or LLM re-scores and reorders it so the best documents land on top."
            },
            {
                id: "chapter7-3",
                title: "MMR — Maximal Marginal Relevance",
                description: "Diversity-aware retrieval that balances relevance against redundancy, dropping near-duplicate chunks so the LLM gets coverage instead of repetition."
            }
        ]
    },
    {
        id: "chapter8",
        title: "Chapter 8: Query Enhancement",
        description: "Improving the query before it hits the retriever — query expansion (rewrite one query into a richer one), query decomposition (split a complex question into sub-questions answered individually), and HyDE (embed a hypothetical LLM-generated answer instead of the question).",
        children: [
            {
                id: "chapter8-1",
                title: "Query Expansion",
                description: "Reformulate a short or vague query into a richer one — covering synonyms, related phrases, and variants — so the retriever catches more relevant chunks."
            },
            {
                id: "chapter8-2",
                title: "Query Decomposition",
                description: "Break a complex, multi-part question into atomic sub-questions, retrieve and answer each individually, then synthesise a final answer — enabling multi-hop reasoning."
            },
            {
                id: "chapter8-3",
                title: "HyDE — Hypothetical Document Embeddings",
                description: "Generate a hypothetical answer with an LLM and embed that instead of the question, matching documents on answer-style content to bridge the query–document vocabulary gap."
            }
        ]
    }
];
