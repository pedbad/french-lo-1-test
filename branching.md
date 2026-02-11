# Branch Sync Plan (Home -> Work)

## Goal
Keep home changes isolated, then safely combine them with your unpushed work-machine changes later.

## 1. At home (now)
Create a branch before continuing work:

```bash
git checkout -b from_home
```

Then work and commit normally on this branch:

```bash
git add .
git commit -m "Continue banner/responsive work from home"
```

Optional (recommended): push this branch so it is backed up:

```bash
git push -u origin from_home
```

## 2. Back at work (where unpushed changes exist)
If changes are not committed yet:

```bash
git checkout -b codex/work-recovered
git add .
git commit -m "Recover unpushed work-machine changes"
git push -u origin codex/work-recovered
```

If work changes are already committed locally:

```bash
git checkout -b codex/work-recovered
git push -u origin codex/work-recovered
```

## 3. Integrate work branch into home branch
On either machine:

```bash
git fetch origin
git checkout from_home
git merge origin/codex/work-recovered
```

Resolve conflicts if prompted, then:

```bash
git add .
git commit
```

## 4. Finalize
Push integrated branch and open PR:

```bash
git push
```

Open PR: `from_home` -> `main`

## If you prefer cherry-pick instead of merge
Use this when `work-recovered` contains a few clean commits:

```bash
git checkout from_home
git cherry-pick <commit-sha>
```
