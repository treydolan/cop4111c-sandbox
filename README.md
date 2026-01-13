# COP4111C - Sandbox

Git repository for Thomas Dolan - Monday January 12, 2026 @ 11:01 PM

## Table of contents

1. [Setup](#Setup)
1. [Changes](#Changes)
1. [Issues](#Issues)

## Setup

To setup this remote repository and its associated local repository, follow the Setup Repository instructions for the assessment in D2L Work on the assessment must be suspended until the setup of the repository has been completed by one team member.

## Changes

Steps to make changes

In GitHub:

1. Assign the issue that will be worked on to yourself. See [Issues](#Issues) below.
1. If no issue exists, open a new issue and assign it to yourself. E.g. `Create site home page` (Ensure that the title is unique and succinct. A detailed description of what work is be completed must be entered.)

In Git Bash (Windows) or Terminal (Mac, Linux):

1. Navigate to the folder where the local repository was created.
1. Check that the correct username and email is set using the `git config -l` command.
1. Switch to the **develop** branch and execute a `git pull` to get the latest code from the remote repository.
1. Add, modify and/or delete a file(s).
1. When the changes are complete:
    1. test the changes
    1. add the file(s) to the staging area `git add <filename>`
    1. commit the changes `git commit -m "<commit message>"`
    1. push the **develop** branch to the remote repository `git push`
1. Close the issue after all required changes have been committed and pushed to the remote repository.

Repeat these steps each time changes are to be made. **NOTE**: Ensure that a `git pull` is regularly executed while checked out on the **develop** branch to get any changes that have been pushed to the develop branch.

To keep the **develop** and **main** branches in sync, complete the following steps in the local repository:

1. Switch to the **main** branch. E.g. `git checkout main`
1. Merge the **develop** branch into the **main** branch. E.g. `git merge develop`
1. Push the changes to the remote repository. E.g. `git push`
1. Switch to the **develop** branch. E.g. `git checkout develop`
1. On the remote repository the develop branch will be even with the main branch.

## Issues

### Open an Issue

1. In the repository, select the `Issues` link.
1. Choose `New issue`.
1. Enter a unique `Title` for the issue.
1. Enter details in the `Write` tab. **Be very specific**. See [Formatting Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for instructions.
1. Choose `Submit new issue`.

### Assign an Issue

1. In the repository, select the `Issues` link.
1. Select the issue that needs to be assigned.
1. Choose the `Assignees` option.
1. Select your name as the assignee to add to the issue.

### Close an Issue

1. In the repository, select the `Issues` link.
1. Select the issue that needs to be closed.
1. Enter closing details in the `Write` tab.
1. Choose `Close and comment`.

### Reopen a Closed an Issue

1. In the repository, select the `Issues` link.
1. Ensure `Closed` issues are displayed.
1. Select the issue that needs to be reopened.
1. Enter reopening details in the `Write` tab.
1. Choose `Reopen issue`.

### Filter issues assigned to you

1. In the repository, select the `Issues` link.
1. Choose the `Assignee` drop down.
1. Select your username from the list.

See [About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues) for more help.
