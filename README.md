# LeapCode

This is the source for [leapcode.org](https://leapcode.org), the website for LeapCode,
a free coding school I founded and run with a four-person team. We teach live online
courses in Python, Java and AI/ML, and run coding competitions. So far I've taught
120+ students Python and machine learning across 11 cohorts.

I built the website and the course curricula, and I teach the Python courses.

## What's in this repo

| Path | What it is |
|---|---|
| `index.html`, `about.html`, `courses.html`, `library.html`, `support.html` | Main pages |
| `courses/` | Python and Java course pages |
| `register/` | Course sign-up and application forms. Submissions go to Google Sheets through Google Apps Script |
| `course_materials/` | Python I lesson notebooks (Jupyter) |
| `files/` | Practice handouts (PDF) |
| `images/` | Logos and photos |
| `style.css` | Shared styles |

## Running it locally

It's plain HTML and CSS with no build step:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The live site is hosted on GitHub Pages, and `CNAME`
points it at leapcode.org.
