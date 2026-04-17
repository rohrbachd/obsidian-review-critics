# Canonical Data Model Baseline

This document defines the canonical conceptual model for review workflow features in this repository.

## Entity: ReviewToken

- Fields:
  - `type`: one of `addition`, `deletion`, `substitution`, `highlight`, `comment`, `anchoredComment`
  - `from`: source start offset (inclusive)
  - `to`: source end offset (exclusive)
- Variant fields:
  - Addition/Deletion/Highlight: `text`
  - Substitution: `oldText`, `newText`
  - Comment: `text`, optional `author`
  - AnchoredComment: `highlightedText`, `commentText`, optional `author`, `highlightRange`, `commentRange`

## Entity: CommentPaneEntry

- Fields:
  - `id`
  - `from`
  - `to`
  - `line`
  - `heading`
  - `commentText`
  - optional `author`
  - optional `highlightedText`

## Entity: ReviewPluginSettings

- Fields:
  - `authorName`
  - `enableReadingView`
  - `enableLivePreview`
  - `previewColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `editingColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)

## Source of Record

- Markdown files in the vault are the source of record for review markup and comment content.
- Plugin settings store is the source of record for user preferences.
