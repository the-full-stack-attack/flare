### **Best Practices for Commit Messages**

1. **Use Conventional Commit Types:**
- `feat`: A new feature for the user.
- `fix`: A bug fix.
- `chore`: Changes to the build process or auxiliary tools.
- `docs`: Documentation only changes.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.).
- `test`: Adding missing tests or correcting existing tests.

2. **Be Descriptive but Concise:**
- Clearly describe what the commit does.
- Avoid overly long commit messages.

3. **Reference Issues or Tasks (if applicable):**
- If you're using an issue tracker, reference the relevant issues in your commit messages.

---

### **Additional Recommendations**

- **Ensure `.env` is in `.gitignore`:**
- To prevent sensitive information from being committed to version control.
```gitignore
# .gitignore
node_modules/
.env
dist/