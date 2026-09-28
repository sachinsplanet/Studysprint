import glob
import re

files = glob.glob('src/**/*', recursive=True)
files = [f for f in files if f.endswith(('.tsx', '.ts'))]

inputs = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    tags = re.finditer(r'<(?P<tag>input|textarea|select)\s+([^>]+)>', text, re.DOTALL)
    for t in tags:
        tag_content = t.group(0)
        line_num = text[:t.start()].count('\n') + 1
        tag_name = t.group('tag')
        
        has_small_font = []
        for s in ['text-xs', 'text-sm', 'text-[12px]', 'text-[13px]', 'text-[14px]', 'text-[15px]']:
            if s in tag_content:
                has_small_font.append(s)
                
        has_inputmode = 'inputmode=' in tag_content.lower()
        type_m = re.search(r'type=([\"\'`][^\"\'`]+[\"\'`])', tag_content)
        type_val = type_m.group(1) if type_m else 'text'
        
        inputs.append((f, line_num, tag_name, type_val, has_small_font, has_inputmode, tag_content))

print(f'Total input/textarea/select elements found: {len(inputs)}')
with open('audit/logs/phase-04b-inputs.txt', 'w', encoding='utf-8') as out:
    out.write(f'=== INPUT & FORM HAZARDS ({len(inputs)} form controls) ===\n\n')
    for f, ln, tag, t_val, sm_f, inpm, content in inputs:
        out.write(f'{f}:{ln} <{tag} type={t_val}> SmallFont: {sm_f} inputMode: {inpm}\n')
        if sm_f:
            out.write(f'  [HAZARD] iOS Safari auto-zooms on inputs with font-size < 16px ({sm_f})\n')
        out.write(f'  Snippet: {content.strip()[:140]}...\n\n')

print('Input audit complete.')
