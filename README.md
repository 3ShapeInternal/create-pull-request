Create Pull Request againts another repository

Usage:
```
    - name: Make a PR
      uses: MindaugasLaganeckas/create-pull-request@v1
      with:
        token: ${{ secrets.SUPER_SECRET }}
        owner: ${{ env.OWNER }}
        repo: ${{ env.REPO }}
        headBranch: ${{ env.DEST_BRANCH }}
        title: "Install Release Drafter"
```        
