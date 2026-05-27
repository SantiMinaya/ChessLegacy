import os
import sys
import re
import subprocess

# Instalar dinámicamente python-docx si no está instalado
try:
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml import OxmlElement, parse_xml
    from docx.oxml.ns import nsdecls, qn
except ImportError:
    print("[INFO] Instalando biblioteca 'python-docx' para la conversion a Word...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
        from docx import Document
        from docx.shared import Inches, Pt, RGBColor
        from docx.enum.text import WD_ALIGN_PARAGRAPH
        from docx.oxml import OxmlElement, parse_xml
        from docx.oxml.ns import nsdecls, qn
        print("[SUCCESS] Biblioteca 'python-docx' instalada exitosamente.")
    except Exception as e:
        print(f"[ERROR] Error al instalar 'python-docx': {e}")
        print("Por favor, instala la biblioteca manualmente ejecutando: pip install python-docx")
        sys.exit(1)

def set_cell_background(cell, fill_hex):
    """Establece el color de fondo de una celda de tabla."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Establece los márgenes internos (padding) de una celda."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_inline_formatting(paragraph, text):
    """Parsea formatos inline básicos como **negrita**, *cursiva* y `código`."""
    parts = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
    
    for part in parts:
        if not part:
            continue
        
        if part.startswith('**') and part.endswith('**'):
            run = paragraph.add_run(part[2:-2])
            run.bold = True
        elif part.startswith('*') and part.endswith('*'):
            run = paragraph.add_run(part[1:-1])
            run.italic = True
        elif part.startswith('`') and part.endswith('`'):
            run = paragraph.add_run(part[1:-1])
            run.font.name = 'Courier New'
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(199, 37, 78)
        else:
            paragraph.add_run(part)

def convert_md_to_docx(md_path, docx_path):
    print(f"[INFO] Leyendo archivo Markdown: {md_path}...")
    if not os.path.exists(md_path):
        print(f"[ERROR] El archivo {md_path} no existe.")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = Document()
    
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(11)
    font.color.rgb = RGBColor(33, 37, 41)

    lines = content.split('\n')
    i = 0
    in_code_block = False
    code_lines = []
    
    while i < len(lines):
        line = lines[i]
        
        if not line.strip() and not in_code_block:
            i += 1
            continue
            
        if line.strip().startswith('```'):
            if in_code_block:
                p = doc.add_paragraph()
                p.paragraph_format.left_indent = Inches(0.5)
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(6)
                
                run = p.add_run('\n'.join(code_lines))
                run.font.name = 'Courier New'
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(40, 40, 40)
                
                pBdr = OxmlElement('w:pBdr')
                left = OxmlElement('w:left')
                left.set(qn('w:val'), 'single')
                left.set(qn('w:sz'), '24')
                left.set(qn('w:space'), '4')
                left.set(qn('w:color'), 'CCCCCC')
                pBdr.append(left)
                p._p.get_or_add_pPr().append(pBdr)
                
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F5F5F5"/>')
                p._p.get_or_add_pPr().append(shd)

                in_code_block = False
                code_lines = []
            else:
                in_code_block = True
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        if line.startswith('# '):
            p = doc.add_heading(level=1)
            p.paragraph_format.space_before = Pt(18)
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(line[2:])
            run.font.name = 'Arial'
            run.font.size = Pt(20)
            run.font.bold = True
            run.font.color.rgb = RGBColor(26, 82, 118)
            
        elif line.startswith('## '):
            p = doc.add_heading(level=2)
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(line[3:])
            run.font.name = 'Arial'
            run.font.size = Pt(15)
            run.font.bold = True
            run.font.color.rgb = RGBColor(41, 128, 185)
            
        elif line.startswith('### '):
            p = doc.add_heading(level=3)
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(line[4:])
            run.font.name = 'Arial'
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = RGBColor(110, 110, 110)
            
        elif line.startswith('> '):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.4)
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            
            pBdr = OxmlElement('w:pBdr')
            left = OxmlElement('w:left')
            left.set(qn('w:val'), 'single')
            left.set(qn('w:sz'), '24')
            left.set(qn('w:space'), '12')
            left.set(qn('w:color'), '2980B9')
            pBdr.append(left)
            p._p.get_or_add_pPr().append(pBdr)
            
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F4F6F7"/>')
            p._p.get_or_add_pPr().append(shd)

            text_content = line[2:]
            text_content = re.sub(r'^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*', '', text_content)
            
            run = p.add_run()
            run.italic = True
            add_inline_formatting(p, text_content)
            
        elif line.strip().startswith('* ') or line.strip().startswith('- '):
            indent_level = len(line) - len(line.lstrip())
            text_content = line.lstrip()[2:]
            
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.left_indent = Inches(0.25 * (indent_level // 2 + 1))
            p.paragraph_format.space_after = Pt(3)
            
            add_inline_formatting(p, text_content)
            
        elif re.match(r'^\d+\.\-?\s+', line.strip()):
            match = re.match(r'^(\d+\.\-?\s+)(.*)', line.strip())
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_after = Pt(3)
            add_inline_formatting(p, match.group(2))

        elif line.strip().startswith('|') and i + 1 < len(lines) and lines[i+1].strip().startswith('|'):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i])
                i += 1
            
            cleaned_rows = []
            for row in table_lines:
                if re.match(r'^\|\s*(:?-+:?\s*\|)+$', row.strip()):
                    continue
                cols = [c.strip() for c in row.split('|')[1:-1]]
                cleaned_rows.append(cols)
            
            if cleaned_rows:
                num_cols = max(len(row) for row in cleaned_rows)
                word_table = doc.add_table(rows=0, cols=num_cols)
                word_table.autofit = True
                
                for r_idx, row_data in enumerate(cleaned_rows):
                    row = word_table.add_row()
                    for c_idx, cell_value in enumerate(row_data):
                        if c_idx < len(row.cells):
                            cell = row.cells[c_idx]
                            cell.text = ""
                            p = cell.paragraphs[0]
                            p.paragraph_format.space_after = Pt(2)
                            p.paragraph_format.space_before = Pt(2)
                            
                            add_inline_formatting(p, cell_value)
                            set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
                            
                            if r_idx == 0:
                                set_cell_background(cell, "1A5276")
                                for run in p.runs:
                                    run.bold = True
                                    run.font.color.rgb = RGBColor(255, 255, 255)
                                if r_idx % 2 == 0:
                                    set_cell_background(cell, "F4F6F7")
                doc.add_paragraph()
            continue

        elif line.strip() == '---':
            doc.add_page_break()

        else:
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.line_spacing = 1.15
            add_inline_formatting(p, line)
            
        i += 1

    print(f"[INFO] Guardando archivo Word en: {docx_path}...")
    doc.save(docx_path)
    print("[SUCCESS] Conversion completada con exito total!")

if __name__ == '__main__':
    default_md = os.path.join(os.path.dirname(__file__), "DOCUMENTACION_COMPLETA.md")
    default_docx = os.path.join(os.path.dirname(__file__), "DOCUMENTACION_COMPLETA.docx")
    
    convert_md_to_docx(default_md, default_docx)
