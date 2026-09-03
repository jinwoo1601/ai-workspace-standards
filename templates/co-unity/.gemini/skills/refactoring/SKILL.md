---
name: refactoring
description: >
  Improves code structure and design while preserving behavior using systematic
  refactoring techniques. Use when: cleaning up code, reducing duplication, improving
  maintainability, or paying down technical debt.
version: 0.1.1
scope: co-unity
status: active
owner: code-writer
last_reviewed: 2026-09-01
prerequisites: none
relates_to:
  - skill: code-review
    type: composes_with
  - skill: test-driven-development
    type: relates_to
gemini-parity: skip
metadata:
  type: process
  triggers:
    - refactor
    - clean up code
    - improve code
    - reduce duplication
    - pay down tech debt
    - code smell
    - improve design
---

## Context

This skill provides systematic refactoring capabilities, transforming code into better designs while ensuring behavior remains unchanged. It emphasizes safety, test coverage, and incremental improvements.

## When to Use

**Code Cleanup**:
- Trigger: "Refactor this code" or "Clean up implementation"
- Use Case: Improving code structure and organization

**Debt Reduction**:
- Trigger: "Pay down technical debt" or "Improve code quality"
- Use Case: Addressing accumulated shortcuts and quick fixes

**Design Improvement**:
- Trigger: "Improve code design" or "Apply design pattern"
- Use Case: Evolving code toward better architecture

**Maintainability**:
- Trigger: "Make code more maintainable" or "Reduce complexity"
- Use Case: Ensuring code remains easy to understand and modify

---

## Execution Steps

## Step 1: Refactoring Preparation

**Purpose**: Ensure safe refactoring environment.

**Preparation Checklist**:
1. **Test Coverage**:
   - [ ] Tests exist for code being refactored
   - [ ] Tests cover main functionality
   - [ ] Tests are currently passing
   - [ ] Tests can be run quickly

2. **Baseline Understanding**:
   - [ ] Code purpose and behavior understood
   - [ ] Current design issues identified
   - [ ] Refactoring goals defined
   - [ ] Success criteria established

3. **Safety Measures**:
   - [ ] Version control committed
   - [ ] Branch created for refactoring
   - [ ] Rollback plan considered
   - [ ] Tests run before starting

**Refactoring Goals**:
- Remove duplication
- Improve names and clarity
- Simplify complex logic
- Apply design patterns
- Reduce coupling
- Increase cohesion

---

## Step 2: Identify Code Smells

**Purpose**: Find specific refactoring opportunities.

**Common Code Smells**:
1. **Duplication**:
   - Duplicated code blocks
   - Similar logic in multiple places
   - Copy-pasted implementations

2. **Long Methods**:
   - Functions doing too many things
   - Methods that are hard to understand
   - Complex nested logic

3. **Large Classes**:
   - Classes with too many responsibilities
   - God objects doing everything
   - Classes with many dependencies

4. **Poor Names**:
   - Unclear variable/function names
   - Abbreviations that aren't obvious
   - Misleading names

5. **Complex Conditionals**:
   - Deep nesting
   - Complex boolean expressions
   - Multiple guard clauses

**Detection Techniques**:
- Code review with checklist
- Static analysis tools (linters, SonarQube)
- Cyclomatic complexity analysis
- Duplicate code detection

**Prioritization**:
- High impact, low risk first
- Areas with good test coverage
- Frequently modified code
- High technical debt areas

---

## Step 3: Apply Refactorings Systematically

**Purpose**: Transform code using proven techniques.

**Refactoring Process**:
1. **Select Small Refactoring**:
   - Choose one specific improvement
   - Ensure test coverage exists
   - Keep change size manageable

2. **Apply Refactoring**:
   - Follow refactoring pattern precisely
   - Make mechanical transformations
   - Don't change behavior

3. **Run Tests**:
   - All tests must pass
   - Behavior unchanged
   - No new test failures

4. **Commit Incremental Change**:
   - Small, atomic commits
   - Clear commit messages
   - Easy to revert if needed

**Common Refactoring Patterns**:

**Extract Method**:
```csharp
// Before
public void ProcessOrder(Order order)
{
    // validate
    if (order.CustomerId == null) throw new InvalidOperationException("No customer");
    if (order.Items.Count == 0) throw new InvalidOperationException("No items");
    // calculate
    float total = 0f;
    foreach (var item in order.Items) total += item.Price;
    float tax = total * 0.1f;
    float final = total + tax;
    // save
    order.Total = final;
    order.Save();
}

// After
public void ProcessOrder(Order order)
{
    ValidateOrder(order);
    float final = CalculateOrderTotal(order);
    SaveOrder(order, final);
}

static void ValidateOrder(Order order)
{
    if (order.CustomerId == null) throw new InvalidOperationException("No customer");
    if (order.Items.Count == 0) throw new InvalidOperationException("No items");
}

static float CalculateOrderTotal(Order order)
{
    float total = 0f;
    foreach (var item in order.Items) total += item.Price;
    return total + total * 0.1f;
}

static void SaveOrder(Order order, float total)
{
    order.Total = total;
    order.Save();
}
```

**Rename Variable/Method**:
```csharp
// Before
float D(float x, float y) => x * y * 24f;

// After
float CalculateDailyHours(float hoursPerDay, float daysWorked) => hoursPerDay * daysWorked * 24f;
```

**Replace Magic Numbers**:
```csharp
// Before
if (score > 75) grade = "A";

// After
const int ExcellenceThreshold = 75;
if (score > ExcellenceThreshold) grade = "A";
```

**Decompose Conditional**:
```csharp
// Before
float CalculateShipping(Order order)
{
    if (order.Customer.IsPremium && order.Total > 100f && order.HasFreeShipping) return 0f;
    if (order.Customer.IsPremium && order.Total > 50f) return 5f;
    return 10f;
}

// After
float CalculateShipping(Order order)
{
    if (QualifiesForFreeShipping(order)) return 0f;
    if (QualifiesForReducedShipping(order)) return 5f;
    return 10f;
}

static bool QualifiesForFreeShipping(Order order) =>
    order.Customer.IsPremium && order.Total > 100f && order.HasFreeShipping;

static bool QualifiesForReducedShipping(Order order) =>
    order.Customer.IsPremium && order.Total > 50f;
```

---

### Unity notes

The review angles find the issue; this skill executes the fix pattern — and in a Unity project the
mechanical part of a refactoring has traps a generic rename does not:

- **Serialized-field renames break scenes and prefabs.** A serialized field is addressed by its
  name in every scene, prefab, and asset that stores it; renaming the field silently drops the
  stored value back to its default. Rename with `[FormerlySerializedAs("oldName")]` on the field,
  keep the attribute for at least one release, and say in the report that scenes and prefabs must
  be re-saved to migrate. If the attribute is not used, the rename is a breaking change and belongs
  in the report as one.
- **Keep `.meta` GUIDs stable when moving files.** Every asset and folder is referenced by the GUID
  in its `.meta`, not by its path. **Move the file and its `.meta` together — never delete and
  re-create**, which mints a new GUID and breaks every reference to it. A folder's own `.meta`
  lives in the parent directory; move that too. Never delete a `.meta`.
- **Respect assembly-definition boundaries.** Extracting a class into another folder can move it
  across an `.asmdef` boundary — check the target assembly's `references` before the move, and do
  not add a reference just to make an extraction compile. A new circular reference is a failed
  refactoring, not a build problem to work around. Test code stays in test assemblies.
- **Public-member changes need a call-site audit that sweeps the harness directories the project
  binds**, not only the asset tree. Uncontrolled build harnesses compile the runtime sources
  directly and break on a signature change nothing under the asset tree references.
- **Engine-specific semantics survive refactoring or the refactoring is wrong**: main-thread-only
  APIs, coroutine and async lifetimes, struct copy semantics, per-frame allocation. Follow the
  project's stated conventions and flag it when a fix as ruled would force a trap.
- **Behavior preservation is proven by the bound gates**, not by reading. Green before, green
  after, with the counts quoted — see the `test-driven-development` skill.

---

## Step 4: Maintain Test Safety Net

**Purpose**: Ensure refactoring doesn't break behavior.

**Test Strategy**:
1. **Before Refactoring**:
   - Run full test suite
   - Document test results
   - Ensure baseline success

2. **During Refactoring**:
   - Run tests after each change
   - Fix any test failures immediately
   - Don't proceed with failing tests

3. **After Refactoring**:
   - Run full test suite
   - Verify behavior unchanged
   - Check for unintended side effects

**Regression Prevention**:
- Keep test coverage high
- Tests should verify behavior, not implementation
- Add tests for edge cases discovered
- Use characterizations tests for legacy code

**Test Safety Indicators**:
✅ **Safe to refactor**:
- Comprehensive test coverage
- Tests verify behavior
- Tests are fast and reliable
- Tests document expected behavior

❌ **Risky to refactor**:
- Low or no test coverage
- Tests test implementation details
- Tests are slow or flaky
- Behavior not clearly specified

---

## Step 5: Incremental Improvement

**Purpose**: Make steady progress without big risks.

**Incremental Approach**:
1. **Small Steps**:
   - One refactoring at a time
   - Commit after each successful change
   - Run tests frequently
   - Stop if tests fail

2. **Build Confidence**:
   - Start with low-risk areas
   - Practice common refactorings
   - Learn patterns and techniques
   - Gradually tackle complex areas

3. **Track Progress**:
   - Document improvements made
   - Measure code quality metrics
   - Track technical debt reduction
   - Celebrate small wins

**Incremental Refactoring Cycle**:
```
Identify Issue → Plan Refactoring → Apply Change → Run Tests → Commit → Repeat
```

**Batching Refactorings**:
- Group related small refactorings
- Make single logical commit
- Keep batch size manageable
- Ensure all tests pass

---

## Step 6: Validate Improvements

**Purpose**: Confirm refactoring achieved goals.

**Validation Checklist**:
1. **Behavior Preservation**:
   - [ ] All tests pass
   - [ ] Functionality unchanged
   - [ ] No regressions introduced
   - [ ] Edge cases handled

2. **Code Quality**:
   - [ ] Code is clearer and more readable
   - [ ] Duplication reduced
   - [ ] Complexity decreased
   - [ ] Names improved

3. **Maintainability**:
   - [ ] Easier to understand
   - [ ] Easier to modify
   - [ ] Better organized
   - [ ] Better documented

4. **Performance**:
   - [ ] Performance not degraded
   - [ ] No unnecessary complexity added
   - [ ] Algorithms appropriate
   - [ ] Resource usage reasonable

**Quality Metrics**:
- Cyclomatic complexity reduced
- Code duplication decreased
- Test coverage maintained or improved
- Lines of code potentially reduced (though not a goal)

---

## Output Format

**For Code Cleanup**:
- Cleaner, more organized code
- Removed duplication
- Improved naming and clarity
- Maintained behavior

**For Debt Reduction**:
- Addressed technical debt
- Improved code structure
- Better design patterns applied
- Increased maintainability

**For Design Improvement**:
- Applied appropriate design patterns
- Better separation of concerns
- Reduced coupling
- Increased cohesion

---

## Best Practices

**Refactoring Discipline**:
✅ **Do**:
- Have test coverage before refactoring
- Make small, incremental changes
- Run tests frequently
- Commit often with clear messages
- Stop if tests fail
- Focus on one improvement at a time

❌ **Don't**:
- Refactor without tests
- Make large, sweeping changes
- Skip running tests to "save time"
- Mix refactoring with feature changes
- Proceed with failing tests
- Try to "fix everything at once"

**Safety First**:
✅ **Do**:
- Create branch for refactoring
- Run tests before starting
- Keep commits atomic
- Document refactoring rationale
- Have rollback plan ready
- Refactor in small steps

❌ **Don't**:
- Refactor on main branch
- Start without baseline tests
- Make large, risky commits
- Refactor without understanding
- Proceed without safety net
- Rush refactoring process

---

## Common Mistakes to Avoid

**Refactoring Anti-Patterns**:
1. **Refactoring Without Tests**: Making changes without safety net
2. **Big Bang Refactoring**: Trying to fix everything at once
3. **Mixed Changes**: Combining refactoring with feature work
4. **Premature Optimization**: Optimizing before measuring
5. **Over-Engineering**: Adding complexity for hypothetical future needs

**Process Anti-Patterns**:
1. **Ignoring Failing Tests**: Continuing despite test failures
2. **Skipping Validation**: Not confirming behavior preserved
3. **No Clear Goal**: Refactoring without specific improvement target
4. **Analysis Paralysis**: Spending too much time planning
5. **Refactoring Procrastination**: Putting off necessary improvements

---

## Related Skills

- **test-driven-development**: For building the test safety net and running the bound gates
- **code-review**: For identifying refactoring opportunities — the angles find, this skill fixes
- **unity-custom-package**: For assembly layout when a refactoring crosses a package boundary
- **plastic-checkin**: For committing each incremental refactoring as its own changeset

---

## Refactoring Tools

**Automated Refactoring**:
- IDE refactoring tools (VS Code, IntelliJ, PyCharm)
- Safe refactoring features
- Automated rename, extract method, etc.
- Cross-language support

**Code Analysis Tools**:
- **SonarQube**: Code quality and technical debt analysis
- **CodeClimate**: Automated code review
- **Linters**: Style and bug detection (ESLint, Pylint)
- **Complexity Analyzers**: Cyclomatic complexity tools

**Duplicate Code Detection**:
- **CPD** (Copy-Paste Detector)
- **JDeodorant**: Eclipse duplicate detection
- **SonarQube**: Duplicate code analysis

---

## Refactoring Patterns Reference

**Organizing Data**:
- Self-Encapsulate Field
- Replace Data Value with Object
- Replace Type Code with Class
- Replace Array with Object

**Simplifying Conditional Expressions**:
- Decompose Conditional
- Consolidate Conditional Expression
- Replace Conditional with Polymorphism
- Introduce Guard Clause

**Simplifying Method Calls**:
- Rename Method
- Add Parameter
- Remove Parameter
- Separate Query from Modifier

**Dealing with Generalization**:
- Pull Up Method
- Push Down Method
- Extract Class
- Inline Class

---

## When NOT to Refactor

**Avoid Refactoring When**:
- Code is about to be replaced
- Time pressure is extreme (document for later)
- No tests available and can't add them
- Code is poorly understood and risky to change
- Business value is low (cost-benefit analysis)

**Alternatives**:
- Rewrite from scratch (for very bad code)
- Document technical debt for future
- Add tests first, then refactor
- Stabilize before improving
- Focus on new features instead
",