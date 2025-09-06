### **Objective: Transform Auto PR into Dynamic HTML template Previews**

---### ** **

```markdown
# Auto PR HTML Previews 🚀

Automatically generate and post dynamic HTML previews of your web app to pull requests.

#### **Current Problem:**
Static screenshots provide limited interactivity and lack the capability to capture dynamic, rich content. Competitors like Percy and Chromatic focus on visual regression testing but miss the opportunity for dynamic HTML previews in CI/CD pipelines.

---

#### **Proposed Solution:**
Replace the existing screenshot functionality with an HTML generator that:
1. Collects pull request metadata (e.g., branch, PR number, files changed).
2. Dynamically generates a customizable HTML preview.
3. Hosts the HTML file on a service (e.g., GitHub Pages or S3).
4. Posts the hosted HTML link as a comment in the pull request.

---

#### **1. Pain Point:**
- Static screenshots lack interactivity.
- Developers need dynamic and richer content in PR previews.

#### **2. Target User:**
- GitHub developers, UI/UX teams, and DevOps engineers optimizing PR pipelines.

#### **3. MVP Features:**
- Replace Puppeteer screenshot logic with an HTML rendering pipeline.
- Use Handlebars.js or EJS for generating customizable HTML templates.
- Host HTML files dynamically and post links in PR comments.

#### **4. Monetization:**
- **Free Tier:** Basic HTML previews.
- **Paid Tier:** Advanced templates, analytics, and enterprise features.

#### **5. PRD (Product Requirements Document):**
- **Input:** PR metadata and optional templates.
- **Output:** Hosted HTML link posted in PR comments.

#### **6. Competitive Analysis:**
- **Percy:** Strong in visual regression testing; lacks HTML-based previews.
- **Chromatic:** Tailored for UI components in Storybook; misses dynamic PR previews.

#### **7. Market Gap:**
- Combine simplicity (Percy) with UI focus (Chromatic) and add interactive HTML previews.

## Features

- ⚡ **Dynamic HTML Previews** - Replace static screenshots with interactive content.
- 💬 **Smart PR Comments** - Post hosted HTML links to PRs.
- 🌐 **Customizable Templates** - Use Handlebars.js or EJS for flexible designs.

---

## Quick Start

### Basic Usage (Recommended)

```yaml
name: HTML Previews
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  html-previews:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      # Start your app (example)
      - run: npm install
      - run: npm run dev &
      
      # Wait for your app to be ready
      - run: npx wait-on http://localhost:3000
      
      - name: Generate HTML Previews
        uses: groupthinking/auto-pr-html-previews@v1
        with:
          url: http://localhost:3000
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## Required Inputs

| Input          | Description                                                  | Required |
|-----------------|--------------------------------------------------------------|----------|
| `github-token` | GitHub token for posting comments and pushing HTML files     | Yes      |
| `url`          | URL of your frontend application                             | No*      |
| `template`     | Path to HTML template file                                   | No       |
| `branch`       | Branch for storing HTML previews                             | No       |

*\* At least one of `url` or `template` must be provided.*

---

## Custom Configuration

Create `.github/html-previews.config.yml` for advanced setups:

```yaml
version: 1

# HTML template settings
template:
  path: .github/template.html
  data:
    appName: MyApp
    prAuthor: ${{ github.actor }}

# Hosting configuration
hosting:
  type: github-pages
  branch: gh-pages

# PR Comment settings
comment:
  enabled: true
  template: |
    🎉 [View HTML Preview](${link})
```

---

## Advanced Examples

### Next.js App

```yaml
- name: Setup and start Next.js
  run: |
    npm install
    npm run build
    npm start &
    npx wait-on http://localhost:3000

- name: Generate HTML Previews
  uses: groupthinking/auto-pr-html-previews@v1
  with:
    url: http://localhost:3000
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Docker Compose Setup

```yaml
- name: Start services
  run: docker-compose up -d

- name: Wait for app
  run: npx wait-on http://localhost:8080

- name: Generate HTML Previews
  uses: groupthinking/auto-pr-html-previews@v1
  with:
    url: http://localhost:8080
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## License

MIT
```

