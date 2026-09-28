import glob
import re

files = glob.glob('src/**/*', recursive=True)
files = [f for f in files if f.endswith(('.tsx', '.ts'))]

all_buttons = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    tags = re.finditer(r'<button\s+([^>]+)>', text, re.DOTALL)
    for t in tags:
        tag_content = t.group(0)
        line_num = text[:t.start()].count('\n') + 1
        cn_m = re.search(r'className=([\"\'`][^\"\'`]+[\"\'`])', tag_content)
        cn = cn_m.group(1) if cn_m else ''
        all_buttons.append((f, line_num, cn))

print(f'Total buttons found: {len(all_buttons)}')
small_suspects = []
for f, ln, cn in all_buttons:
    if any(k in cn for k in ['w-5', 'w-6', 'w-7', 'w-8', 'h-5', 'h-6', 'h-7', 'h-8', 'p-1 ']):
        small_suspects.append((f, ln, cn))

print(f'Small button suspects: {len(small_suspects)}')
with open('audit/logs/phase-04b-touch-targets.txt', 'w', encoding='utf-8') as out:
    out.write(f'=== TOUCH TARGET AUDIT: SUSPECT ELEMENTS UNDER 44x44 CSS PX ({len(small_suspects)} hits) ===\n\n')
    for f, ln, cn in small_suspects:
        out.write(f'{f}:{ln}\n  {cn}\n\n')
