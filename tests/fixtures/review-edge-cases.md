# Review Edge Cases Fixture

Malformed comment starts {>> [author=Daniel] never closes.

Nested-like token should remain plain text in v1: {==outer {++inner++} token==}

```md
Code block token-like text should not parse: {==ignore me==}{>> no parse <<}
```

Orphan highlight only: {==orphan==}

Orphan comment only: {>> [author=Alex] orphan comment <<}
