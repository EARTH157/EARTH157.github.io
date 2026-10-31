---
title: 'Tamra: offline RAG for Thai, English and Chinese documents'
shortTitle: Tamra
kicker: Open source · Oct 2026 – Present
summary: A desktop app for Windows and Ubuntu that answers questions over local files with citations, with no data leaving the machine. Hybrid search (SQLite FTS5 + sqlite-vec, bge-m3) plus a reranker took hit@1 from 0.67 to 1.00.
order: 2
cover: ../../assets/work/tamra-app.webp
coverAlt: 'Tamra desktop app: project folders in the sidebar and an Ask your documents prompt with answer mode, folder, model and Think longer options'
coverStyle: screen
facts:
  - { value: '0.67 → 1.00', label: 'hit@1 after hybrid search + reranker' }
  - { value: '24', label: 'questions in the retrieval evaluation' }
  - { value: '3', label: 'document languages (Thai, English, Chinese)' }
  - { value: 'Offline', label: 'no data leaves the machine' }
specs:
  - { label: What, value: 'Offline desktop RAG app with cited Q&A' }
  - { label: Languages, value: 'Thai, English and Chinese documents' }
  - { label: Retrieval, value: 'Hybrid search: SQLite FTS5 + sqlite-vec (bge-m3), plus a reranker' }
  - { label: Platform, value: 'Windows · Ubuntu' }
tags: [RAG, bge-m3, sqlite-vec, FTS5, Reranker]
metric:
  label: Retrieval hit@1 · 24-question eval
  baselineLabel: Baseline
  baseline: 0.67
  finalLabel: Hybrid + reranker
  final: 1.00
github: https://github.com/EARTH157/Tamra
---

## What it does

Tamra answers questions over a folder of local documents and cites the passage each answer came from, so every answer can be checked. Everything runs offline.

## Retrieval

Hybrid search combines SQLite FTS5 keyword search with sqlite-vec vector search over bge-m3 embeddings, then a reranker orders the candidates. On a 24-question evaluation this lifted hit@1 from 0.67 to 1.00.
