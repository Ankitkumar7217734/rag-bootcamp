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
    },
    {
        id: "chapter9",
        title: "Chapter 9: Multimodal RAG — Going Beyond Text",
        description: "Extending RAG to handle text AND images in a unified pipeline — CLIP embeddings for shared vector space, PDF parsing with PyMuPDF, unified FAISS index, GPT-4V for multimodal answer generation, and the complete ten-step end-to-end flow."
    },
    {
        id: "chapter10",
        title: "Chapter 10: AI Agents vs Agentic AI",
        description: "The leap from single-purpose AI agents to collaborative agentic systems — clear definitions and a side-by-side comparison, the perception → reasoning → action → learning loop, the LLM as the agent's brain (with tools and memory), real examples (chatbots and banking bots vs smart homes and health assistants), and a full worked example of an agentic AI software-development team with human feedback in the loop."
    },
    {
        id: "chapter11",
        title: "Chapter 11: LangGraph — Building Stateful Workflows",
        description: "Where agents stop being theory and get built — modelling an app as a graph of nodes and edges over a shared state, the LangChain ecosystem, conditional routing, compile and invoke, and the five-step recipe behind every LangGraph.",
        children: [
            {
                id: "chapter11-1",
                title: "State Schemas — TypedDict, Dataclass & Pydantic",
                description: "The three ways to define a graph's state — TypedDict (hints only), dataclass (dot access + defaults), and Pydantic BaseModel (runtime validation) — over one shared graph, and when each is the right call."
            },
            {
                id: "chapter11-2",
                title: "Building a Chatbot",
                description: "Using a list of messages as the graph state, the add_messages reducer that appends instead of overwriting, plugging in provider-agnostic chat models (OpenAI / Groq), and streaming the response node by node."
            },
            {
                id: "chapter11-3",
                title: "Chains, Tools & the Router Agent",
                description: "Binding tools to an LLM, the structured tool call, executing it with ToolNode, and the tools_condition router that lets the model choose between answering directly and calling a tool — the simplest agent."
            }
        ]
    },
    {
        id: "chapter12",
        title: "Chapter 12: Agents — Tools, ReAct & the Agentic Loop",
        description: "Turning a chatbot into an agent — the act/observe/reason ReAct loop, writing and binding real tools (arXiv, Wikipedia, Tavily, math), the ToolNode + tools_condition loop that lets the LLM call tools and come back, memory via checkpointers and threads (graph, super-steps, checkpoints), and tracing every step with LangSmith."
    },
    {
        id: "chapter13",
        title: "Chapter 13: Agentic RAG — Retrieval as a Decision",
        description: "Putting an agent in charge of retrieval — wrapping retrievers as tools the LLM can call, routing a question across multiple vector stores by tool description, grading retrieved documents for relevance with structured output, and the agent → retrieve → grade → generate / rewrite loop that lets a RAG system recover from a bad retrieval instead of answering from it.",
        children: [
            {
                id: "chapter13-1",
                title: "Knowledge Bases & Retriever Tools",
                description: "Building the ingredients — two independent FAISS vector stores (LangGraph and LangChain docs) and wrapping each retriever with create_retriever_tool so the agent can route a question to the right store using only the tool descriptions."
            },
            {
                id: "chapter13-2",
                title: "The Graph — State, Nodes & Edges",
                description: "The message-based AgentState and the add_messages reducer, the four nodes (agent, retrieve, generate, rewrite), the grade_documents conditional edge with structured output, and wiring it all into a compiled StateGraph."
            },
            {
                id: "chapter13-3",
                title: "Running, the Loop & Hardening",
                description: "Invoking the agent on three questions — a clean retrieval, routing to the second store, and an off-topic query that triggers the rewrite loop — tracing the messages step by step, and bounding the loop with attempt counters and fallbacks so it never runs away."
            }
        ]
    },
    {
        id: "chapter14",
        title: "Chapter 14: ReAct Agents — Reasoning, Acting & Observing",
        description: "How create_react_agent turns an LLM into a self-directed Think → Act → Observe loop — wrapping retrievers, Wikipedia, and ArXiv as tools, building a reusable tool factory for any text knowledge base, and understanding when to use the prebuilt ReAct agent versus a custom Agentic RAG graph."
    },
    {
        id: "chapter15",
        title: "Chapter 15: Autonomous RAG — Planning, Reflecting & Self-Correcting",
        description: "Building a RAG system that runs itself — five LangGraph techniques (chain-of-thought, self-reflection, query planning & decomposition, iterative retrieval, and multi-source synthesis), each built hands-on from the source notebooks, then composed into one self-managing loop.",
        children: [
            {
                id: "chapter15-1",
                title: "Chain-of-Thought RAG",
                description: "From 3-COTRag.ipynb — a planner → retriever → responder graph that decomposes a question into reasoning steps, retrieves per step from research_notes.txt, and synthesizes one reasoned answer."
            },
            {
                id: "chapter15-2",
                title: "Self-Reflection",
                description: "From 4-Selfreflection.ipynb — a reflector node and conditional edge that lets the LLM grade its own answer and loop back to retrieval when the response is incomplete, bounded by an attempts counter."
            },
            {
                id: "chapter15-3",
                title: "Query Planning & Decomposition",
                description: "From 5-QueryPlanningdecomposition.ipynb — splitting a multi-topic question into sub-questions, retrieving each against Lilian Weng blog posts, and merging context into one consolidated answer."
            },
            {
                id: "chapter15-4",
                title: "Iterative Retrieval",
                description: "From 6-iterativeretrieval.ipynb — a retrieve → answer → reflect → refine loop that rewrites the query and retrieves again when the first pass is not good enough."
            },
            {
                id: "chapter15-5",
                title: "Answer Synthesis from Multiple Sources",
                description: "From 7-answersynthesis.ipynb — four retrieval sources (internal docs, YouTube, Wikipedia, ArXiv) merged by a synthesizer node, plus the Autonomous RAG definition, complete workflow, and Agentic-vs-Autonomous comparison."
            }
        ]
    },
    {
        id: "chapter16",
        title: "Chapter 16: Multi-Agent RAG Systems",
        description: "Splitting the RAG pipeline into specialized agents — a peer network with Command handoffs, a central supervisor with create_supervisor, and hierarchical nested teams for research-and-write projects — built from 8-multiagent.ipynb.",
        children: [
            {
                id: "chapter16-1",
                title: "Multi-Agent Network RAG",
                description: "From 8-multiagent.ipynb — a researcher agent (FAISS retriever + Tavily) and a blog writer agent hand work back and forth via Command routing until one signals FINAL ANSWER."
            },
            {
                id: "chapter16-2",
                title: "Supervisor Multi-Agent RAG",
                description: "A central supervisor delegates to a research agent (RAG + web) and a math agent (arithmetic tools) using create_supervisor from langgraph-supervisor — one worker at a time."
            },
            {
                id: "chapter16-3",
                title: "Hierarchical Agent Teams With RAG",
                description: "Nested subgraphs — a research team (search + web scraper) and a writing team (note taker + doc writer + chart generator) — composed under a top-level supervisor for multi-phase projects."
            }
        ]
    },
    {
        id: "chapter17",
        title: "Chapter 17: Corrective RAG (CRAG)",
        description: "Adding self-reflection and self-grading to retrieval — from 2-CorrectiveRAG.ipynb, a LangGraph workflow that grades every retrieved document, and when any is irrelevant, re-writes the question and falls back to Tavily web search before generating, so the LLM never answers from weak context."
    },
    {
        id: "chapter18",
        title: "Chapter 18: Adaptive RAG",
        description: "Routing plus self-correction — from 4-AdaptiveRAG_1.ipynb, a LangGraph state machine that first routes each question to the vectorstore or web search, then grades documents, checks the answer for hallucinations and usefulness, and rewrites-and-retries until the response is grounded and resolves the question."
    },
    {
        id: "chapter19",
        title: "Chapter 19: RAG with Persistent Memory",
        description: "Giving a RAG agent conversational memory — from ragmemory.ipynb, a checkpointer plus a thread_id that persists MessagesState across calls so follow-up questions resolve, built two ways: a custom query_or_respond → tools → generate graph and the prebuilt create_react_agent, each shown as a compiled LangGraph."
    },
    {
        id: "chapter20",
        title: "Chapter 20: Cache-Augmented Generation (CAG)",
        description: "Answering repeat questions in 0.00 seconds — from cache_augment_generation.ipynb, a simple exact-match dict cache (and why it breaks on rephrasing), then a semantic FAISS cache built as a LangGraph: normalize → semantic_cache_lookup branches on an L2 distance threshold to serve from cache or run retrieve → generate → cache_write."
    },
    {
        id: "chapter21",
        title: "Chapter 21: Vectorless RAG — Reasoning-Based Retrieval with PageIndex",
        description: "RAG with no vector DB, no chunking, no embeddings — from the PageIndex crash-course notebook and the Vectorless vs Traditional RAG deck: why similarity ≠ relevance breaks vector search on professional documents, building a hierarchical tree index from a PDF, LLM tree search, the search → retrieve → generate pipeline with page citations, expert-guided retrieval via prompt rules, the Chat API and self-hosted option, and the two-question decision heuristic plus the hybrid pattern."
    },
    {
        id: "chapter22",
        title: "Chapter 22: Guardrails — Building Safe, Compliant AI Agents",
        description: "Making agents safe for production — from the LangChain guardrails crash-course notebook: deterministic vs model-based checks, the built-in PIIMiddleware (redact/mask/hash/block) and HumanInTheLoopMiddleware (interrupt → approve/edit/reject via a checkpointer), custom before_agent input filters and after_agent output validators, stacking five layers of defense in one middleware array, and a healthcare chatbot capstone with PII redaction, approval gates, and auto-disclaimers."
    },
    {
        id: "chapter23",
        title: "Chapter 23: LLM Gateways — One Control Plane for Every Model",
        description: "Putting a production control plane between applications and model providers — from the LiteLLM gateway tutorial and handwritten architecture notes: one unified API, automatic fallbacks, caching, task-aware routing, load balancing, cost and latency tracking, LangChain integration, centralized policy, and the path from an in-process SDK to a shared gateway proxy."
    }
];
