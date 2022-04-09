
- Rebase is one of the two Git Utilities
- what the fuck is a "git bisect"
- 

- git rebase --onto <newbase> <oldbase>

   o---o---o---o---o  main
        \
         o---o---o---o---o  featureA
              \
               o---o---o  featureB
   
# You found out featureB does not depend on anything in feature A
# So might as well have taken it from "main"
# have the changes in feature B based on the current "main" branch

- git rebase --onto main featureA featureB              


                      o---o---o  featureB
                     /
    o---o---o---o---o  main
     \
      o---o---o---o---o  featureA
      
# Dangers of rebase

Further reading:

- (done)[git-log](https://www.atlassian.com/git/tutorials/git-log)
- (done)[git-reflog](https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog)
- (done)[rewriting history](https://www.atlassian.com/git/tutorials/rewriting-history)
- [git bisect](https://git-scm.com/docs/git-bisect)
- (done) [git bisect](https://www.metaltoad.com/blog/beginners-guide-git-bisect-process-elimination)

# "rewriting history"

[doc](https://www.atlassian.com/git/tutorials/rewriting-history)

# ammended commits are entirely new commits and the previous commit will not be on your current branch

git commit --ammend --no-edit 

# git reflog (reference logs)

[doc](https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog)


Shows history of the head of the branch

Use it to correct if you issued command like `git reset --hard <hash>`
You can find the previous commit the HEAD of the branch pointed too.


Example: 

``bash
git reflog --relative-date

a5e78bce2 (HEAD -> feature/PAYS-7991, origin/feature/PAYS-7991) HEAD@{21 hours ago}: commit: feature(svg-images): PAYS-7991
18b1a0e1a HEAD@{21 hours ago}: commit: feature(svg-images): PAYS-7991
74a06c2ae HEAD@{22 hours ago}: checkout: moving from develop to feature/PAYS-7991
76136ca78 (origin/develop, origin/HEAD, develop) HEAD@{23 hours ago}: checkout: moving from feature/PAYS-7991 to develop
74a06c2ae HEAD@{24 hours ago}: commit: feature(svg-images): PAYS-7991
341ce76dd HEAD@{26 hours ago}: rebase -i (finish): returning to refs/heads/feature/PAYS-7991
341ce76dd HEAD@{26 hours ago}: rebase -i (reword): feature(svg-images): PAYS-7991
905f21a28 HEAD@{26 hours ago}: rebase -i: fast-forward

60ac2478e HEAD@{2 days ago}: commit: feature(svg-images): PAYS-7991
d5ff18ede HEAD@{2 days ago}: commit: feature(svg-images): PAYS-7991
d909f67ae HEAD@{2 days ago}: reset: moving to d909f67
48c369c66 HEAD@{2 days ago}: rebase finished: returning to refs/heads/feature/PAYS-7991
48c369c66 HEAD@{2 days ago}: rebase: feature(paymentoptions graphics as svg): PAYS-7991
873d6829f HEAD@{2 days ago}: rebase: checkout develop
```

There are branch tip reflogs, also `git stash` reflogs.

## Basic usage

```bash
git reflog

#short cut for 

git reflog show HEAD

# sample output

a5e78bce2 (HEAD -> feature/PAYS-7991, origin/feature/PAYS-7991) HEAD@{0}: commit: feature(svg-images): PAYS-7991
18b1a0e1a HEAD@{1}: commit: feature(svg-images): PAYS-7991
74a06c2ae HEAD@{2}: checkout: moving from develop to feature/PAYS-7991
76136ca78 (origin/develop, origin/HEAD, develop) HEAD@{3}: checkout: moving from feature/PAYS-7991 to develop
74a06c2ae HEAD@{4}: commit: feature(svg-images): PAYS-7991
341ce76dd HEAD@{5}: rebase -i (finish): returning to refs/heads/feature/PAYS-7991
341ce76dd HEAD@{6}: rebase -i (reword): feature(svg-images): PAYS-7991
905f21a28 HEAD@{7}: rebase -i: fast-forward
76136ca78 (origin/develop, origin/HEAD, develop) HEAD@{8}: rebase -i (start): checkout 76136ca78eb695c203bdeafb22e4d80c13c55ed5
905f21a28 HEAD@{9}: reset: moving to 905f21a28284566bb88c5c0475182f2bf3efad08
5049cdee8 HEAD@{10}: rebase -i (finish): returning to refs/heads/feature/PAYS-7991
5049cdee8 HEAD@{11}: rebase -i (squash): feature(svg-images): PAYS-7991
```

Reflogs can reference:

- HEAD
- tag
- remotes
- other branches
- stash

Show other branches reflog (example)

```bash

git reflog show develop

76136ca78 (origin/develop, origin/HEAD, develop) develop@{0}: pull: Fast-forward
873d6829f develop@{1}: pull: Fast-forward
621010e92 develop@{2}: reset: moving to 621010e92ff09b749eb912629ef625e43c725
1ac5944d1 develop@{3}: commit: feature(svg as components): PAYS-7991
621010e92 develop@{4}: pull: Fast-forward
369732be0 develop@{5}: pull: Fast-forward
e604f9a5d develop@{6}: pull: Fast-forward
6d1988574 develop@{7}: pull: Fast-forward
1085f590d develop@{8}: pull: Fast-forward
61a93e0ff develop@{9}: pull: Fast-forward
74679c94e develop@{10}: pull: Fast-forward
```

Show stash reflog

```bash
git reflog stash

445b51c (refs/stash) stash@{0}: WIP on master: d31a1af chore(release): 1.14.0 [skip ci]
```

Can also look at differences between 

```bash

git diff stash@{0} master@{0}

# since master is the current branch this would also work

git diff stash@{0}


 
 
diff --git a/package.json b/package.json
index f24411f..663e651 100755
--- a/package.json
+++ b/package.json
@@ -1,4 +1,4 @@
-{   
+{
     "name": "sales",
     "version": "1.14.0",
     "description": "Sales repository",
```

Timed reflogs

git diff main@{0} main@{1.day.ago} 

relative qualifiers:

- 1.minute.ago
- 1.hour.ago
- 1.day.ago
- yesterday
- 1.week.ago
- 1.month.ago
- 1.year.ago
- 1.day.2hours.ago (combined)

absolute time:

- "2011-05-17.09:00:00"

Subcommands & config options

- git reflog expire

The expire subcommand cleans up old or unreachable reflog
(typicly used by git internally)

use with dry run to see what it will do

- git reflog expire -n
- (alias for) git reflog expire --dry-run


- git reflog delete 

Delete a reflog entry (not normally used by end users)

## Recovering lost commits

Git never really loses anything, even when performing history rewriting operations like rebasing or commit amending.

Example

Git log looks like this

```bash
git log --pretty=oneline

338fbcb41de10f7f2e54095f5649426cb4bf2458 extended content
1e63ceab309da94256db8fb1f35b1678fb74abd4 bunch of content
c49257493a95185997c87e0bc3a9481715270086 flesh out intro
eff544f986d270d7f97c77618314a06f024c7916 migrate existing content
bf871fd762d8ef2e146d7f0226e81a92f91975ad Add Git Reflog outline
35aee4a4404c42128bee8468a9517418ed0eb3dc initial commit add git-init and setting-up-a-repo docs
```

Now we add some changes

```bash
#make changes to HEAD
git commit -am "some WIP changes"  # -am = add + message
```

Now the log looks like this

```bash
git log --pretty=oneline

37656e19d4e4f1a9b419f57850c8f1974f871b07 some WIP changes
338fbcb41de10f7f2e54095f5649426cb4bf2458 extended content
1e63ceab309da94256db8fb1f35b1678fb74abd4 bunch of content
c49257493a95185997c87e0bc3a9481715270086 flesh out intro
eff544f986d270d7f97c77618314a06f024c7916 migrate existing content
bf871fd762d8ef2e146d7f0226e81a92f91975ad Add Git Reflog outline
35aee4a4404c42128bee8468a9517418ed0eb3dc initial commit add git-init and setting-up-a-repo docs
```

We now perform interactive rebase with remote main branch

```bash
git rebase -i origin/main 

# rebase happens, we squash stuff

git log --pretty=oneline

40dhsoi37656e19d4e4f1a9b419f57850ch87dah987698hs some WIP changes
35aee4a4404c42128bee8468a9517418ed0eb3dc initial commit add git-init and setting-up-a-repo docs 
```

But we want to operate on the commits we have

```bash
git reflog

37656e1 HEAD@{0}: rebase -i (finish): returning to refs/heads/git_reflog
37656e1 HEAD@{1}: rebase -i (start): checkout origin/main
37656e1 HEAD@{2}: commit: some WIP changes 

```

Now we want to reset the head to the commit we made with "some WIP changes"
This will restore the squashed commits

```bash

git reset HEAD@{2} 
``

## Advanced git log

`--oneline` option will format the log on one line
`--decorate` will show branch info


git log --pretty=format:"%cn committed %h on %cd"

%cn = commit name
%h = commit hash
%cd = commit date

| abbrev | desc                                                                                     |
|--------|------------------------------------------------------------------------------------------|
| %H     | commit hash                                                                              |
| %h     | abbreviated commit hash                                                                  |
| %T     | tree hash                                                                                |
| %t     | abbreviated tree hash                                                                    |
| %P     | parent hashes                                                                            |
| %p     | abbreviated parent hashes                                                                |
| %an    | author name                                                                              |
| %aN    | author name (respecting .mailmap, see git-shortlog(1) or git-blame(1))                   |
| %ae    | author email                                                                             |
| %aE    | author email (respecting .mailmap, see git-shortlog(1) or git-blame(1))                  |
| %al    | author email local-part (the part before the @ sign)                                     |
| %aL    | author local-part (see %al) respecting .mailmap, see git-shortlog(1) or git-blame(1))    |
| %ad    | author date (format respects --date= option)                                             |
| %aD    | author date, RFC2822 style                                                               |
| %ar    | author date, relative                                                                    |
| %at    | author date, UNIX timestamp                                                              |
| %ai    | author date, ISO 8601-like format                                                        |
| %aI    | author date, strict ISO 8601 format                                                      |
| %as    | author date, short format (YYYY-MM-DD)                                                   |
| %ah    | author date, human style (like the --date=human option of git-rev-list(1))               |
| %cn    | committer name                                                                           |
| %cN    | committer name (respecting .mailmap, see git-shortlog(1) or git-blame(1))                |
| %ce    | committer email                                                                          |
| %cE    | committer email (respecting .mailmap, see git-shortlog(1) or git-blame(1))               |
| %cl    | committer email local-part (the part before the @ sign)                                  |
| %cL    | committer local-part (see %cl) respecting .mailmap, see git-shortlog(1) or git-blame(1)) |
| %cd    | committer date (format respects --date= option)                                          |
| %cD    | committer date, RFC2822 style                                                            |
| %cr    | committer date, relative                                                                 |
| %ct    | committer date, UNIX timestamp                                                           |
| %ci    | committer date, ISO 8601-like format                                                     |
| %cI    | committer date, strict ISO 8601 format                                                   |
| %cs    | committer date, short format (YYYY-MM-DD)                                                |
| %ch    | committer date, human style (like the --date=human option of git-rev-list(1))            |
| %d     | ref names, like the --decorate option of git-log(1)                                      |
| %D     | ref names without the " (", ")" wrapping.                                                |

git shortlog   # groups commit by author

## Graphs

```bash
git log --graph --oneline --decorate # example
```

## Custom Formatting

Example:

```bash
git log --pretty=format:"%cn committed %h on %cd"

Mirza Hukic committed ffa13a96b on Fri Apr 1 14:37:03 2022 +0200
alekscom committed 6b0c2fb21 on Fri Apr 1 13:47:34 2022 +0200
GitHub committed 9d5f91765 on Thu Mar 31 20:41:35 2022 +0200
Seth Falco committed 6bbec726b on Thu Mar 31 19:12:45 2022 +0100
```


## Filtering commit history

git log -3  # last 3 commits

git log --after="2014-7-1"  #show all commits after date "2014-7-1"

also possible formats

--after="yesterday"

time window , you can use --before and --after 

--since is an alias for --after
--until is an alias for --before

### Filter by author

git log --author="John"
git log --author="John\|Mary"  # regexp (John|Mary)

### Filter by message

git log --grep="PAYS-7991"

### By File

git log -- foo.py bar.py

### By Content (pickaxe)

git log -S"Hello, World!"  # filter by files having content "Hello, World!"

### By Range

git log ..

git log main..feature  # all the commits that are in the feature branch but are not in the main branch


### Filtering (out) Merge Commits

git log --no-merges # omit no merges

git log --merges # include ONLY merges

## GIT BISECT

Nice tutorial here

```bash
```

```bash
# make a clean git repo as playground
mkdir git_bisect_tests
cd git_bisect_tests/
git init
```

Make changes add commits

```bash

# commit 1
echo row > test.txt
git add -A && git commit -m "Adding first row"

# commit 2
echo row >> test.txt
git add -A && git commit -m "Adding second row"

# commit 3
echo row >> test.txt
git add -A && git commit -m "Adding third row"

# commit 4
echo your >> test.txt
git add -A && git commit -m "Adding the word 'your'"

# commit 5 (good commit)
echo boat >> test.txt
git add -A && git commit -m "Adding the word 'boat'"

echo gently >> test.txt
git add -A && git commit -m "Adding the word 'gently'"

sed -i -e 's/boat/car/g' test.txt
git add -A && git commit -m "Changing the word 'boat'to 'car'"

echo down >> test.txt
git add -A && git commit -m "Adding the word 'down'"

echo the >> test.txt
git add -A && git commit -m "Adding the word 'the'"

echo stream >> test.txt
git add -A && git commit -m "Adding the word 'stream'"
```

The bug in the file is "boat" was changed to "car"

Find the commit wich made the bad entry

```bash

git log --oneline

6b62718 (HEAD -> master) Adding the word 'stream'
2b3bfe5 Adding the word 'the'
a3f4f3b Adding the word 'down'
ec1c8e3 Changing the word 'boat' to 'car'
70eec30 Adding the word 'gently'
13db929 Adding the word 'boat'
57c59ca Adding the word 'your'
3e41719 Adding third row
890cd34 Adding second row
25490aa Adding first row
```

Enter the bisect


```bash
 
git bisect start # always first thing to do

git bisect good 13db9297ba5c9 # mark the good commit
git bisect bad ec1c8e36fff5cef68 # mark the bad commit

#now the bisect has done its thing, check logs again

```bash
git log --oneline

70eec30 (HEAD) Adding the word 'gently'
13db929 (refs/bisect/good-13db9297ba5c9a55e44093a80b4a3e5cb62b173d) Adding the word 'boat'
57c59ca Adding the word 'your'
3e41719 Adding third row
890cd34 Adding second row
25490aa Adding first row
```

To end the bisect wizard 

```bash
git bisect reset
```




































































mongo database db copy method for staging data


Production cluster

   
   
Device:
Mongo Database server
+Users
.
.


plantUML


database  

node "Production Replica Set" {

  database "Primary"
  database "Secondary 1"
  database "Secondary 2"
  database "Secondary N"
  
  Primary -- "Secondary 1"
  Primary -- "Secondary 2"
  Primary -- "Secondary N"
} 

Initial Situation:

@startuml
node "Production MongoDB Replica Set" {

  database "Primary"
  database "Secondary_1"
  database "Secondary_2"
  database "Secondary_N"
  
  Primary -- Secondary_1
  Primary -- Secondary_2
  Primary -- Secondary_N
}

node "Staging Realm" {

database Secondary_Hidden_delayed_2
database Secondary_Hidden_delayed_1
Primary -- Secondary_Hidden_delayed_2
Primary -- Secondary_Hidden_delayed_1
}
@enduml

Step 1:

Make Secondary_Hidden_delayed_1 standalone so it can be used for staging (near instant availability for staging)

@startuml
node "Production MongoDB Replica Set" {

  database "Primary"
  database "Secondary_1"
  database "Secondary_2"
  database "Secondary_N"
  
  Primary -- Secondary_1
  Primary -- Secondary_2
  Primary -- Secondary_N
}

node "Staging Realm" {

database Secondary_Hidden_delayed_2
database Secondary_Hidden_delayed_1
Primary -- Secondary_Hidden_delayed_2
}
@enduml

Step 2: (24 hours later)

1. Add secondary_hidden_delayed_1 back to Production replica set as a "hidden" (will have 24h to sync)
2. Make Secondary_Hidden_delayed_2 standalone and near instant available for staging

@startuml
node "Production MongoDB Replica Set" {

  database "Primary"
  database "Secondary_1"
  database "Secondary_2"
  database "Secondary_N"
  
  Primary -- Secondary_1
  Primary -- Secondary_2
  Primary -- Secondary_N
}

node "Staging Realm" {

database Secondary_Hidden_delayed_2
database Secondary_Hidden_delayed_1
Primary -- Secondary_Hidden_delayed_1
}
@enduml

Step 3: (24 hours later)

1. Add secondary_hidden_delayed_2 back to Production replica set as a "hidden" (will have 24h to sync)
2. Make Secondary_Hidden_delayed_1 standalone and near instant available for staging

Go to Step 2










