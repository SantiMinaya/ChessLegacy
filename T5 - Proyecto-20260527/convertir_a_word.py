import os
import sys
import re
import subprocess
import base64
import urllib.request
import urllib.error

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
        sys.exit(1)

def strip_emojis(text):
    """Elimina emojis y caracteres especiales no académicos del texto."""
    # Rango de emojis estándar y símbolos de adorno
    emoji_pattern = re.compile(
        '['
        '\u2600-\u27BF]|' # Símbolos misceláneos y Dingbats
        '[\uE000-\uF8FF]|' # Área de uso privado
        '\uD83C[\uDC00-\uDFFF]|' # Emojis, banderas, etc.
        '\uD83D[\uDC00-\uDFFF]|'
        '\uD83E[\uDC00-\uDFFF]'
        ']', flags=re.UNICODE
    )
    # Reemplazar emojis y limpiar espacios adicionales
    clean_text = emoji_pattern.sub('', text)
    # Limpiar algunos caracteres específicos de adorno que puedan haber quedado
    for char in ["🔍", "♟", "🎓", "📝", "📑", "🗄", "🧩", "🔄", "🌟", "🚀", "📄", "⚙", "📚"]:
        clean_text = clean_text.replace(char, "")
    return clean_text.strip()

def download_mermaid_diagram(mermaid_code, output_path):
    """Codifica el diagrama Mermaid y descarga el renderizado en PNG usando Kroki/Mermaid.ink."""
    try:
        print(f"[INFO] Descargando diagrama en PNG...")
        # Limpiar sintaxis específicas de Kroki / Mermaid.ink
        clean_code = mermaid_code.strip()
        # Codificación base64 url safe
        encoded = base64.urlsafe_b64encode(clean_code.encode('utf-8')).decode('utf-8')
        url = f"https://mermaid.ink/img/{encoded}"
        
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())
        print(f"[SUCCESS] Diagrama guardado en: {output_path}")
        return True
    except Exception as e:
        print(f"[WARNING] No se pudo renderizar el diagrama online: {e}")
        return False

def set_cell_borders_apa(cell, top=False, bottom=False):
    """Aplica bordes horizontales finos negros (Estilo Científico/APA) a una celda."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    
    # Limpiar bordes existentes
    for b in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{b}')
        border.set(qn('w:val'), 'none')
        tcBorders.append(border)
        
    # Añadir bordes solicitados
    if top:
        top_b = OxmlElement('w:top')
        top_b.set(qn('w:val'), 'single')
        top_b.set(qn('w:sz'), '4') # Grosor fino (0.5 pt)
        top_b.set(qn('w:color'), '000000') # Negro
        tcBorders.append(top_b)
        
    if bottom:
        bottom_b = OxmlElement('w:bottom')
        bottom_b.set(qn('w:val'), 'single')
        bottom_b.set(qn('w:sz'), '4') # Grosor fino (0.5 pt)
        bottom_b.set(qn('w:color'), '000000') # Negro
        tcBorders.append(bottom_b)
        
    tcPr.append(tcBorders)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    """Establece los márgenes internos (padding) de una celda."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_inline_formatting(paragraph, text, is_italic_only=False):
    """Parsea formatos inline básicos como **negrita**, *cursiva* y `código`."""
    clean_text = strip_emojis(text)
    parts = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', clean_text)
    
    for part in parts:
        if not part:
            continue
        
        if part.startswith('**') and part.endswith('**'):
            run = paragraph.add_run(part[2:-2])
            run.bold = True
            if is_italic_only:
                run.italic = True
        elif part.startswith('*') and part.endswith('*'):
            run = paragraph.add_run(part[1:-1])
            run.italic = True
        elif part.startswith('`') and part.endswith('`'):
            run = paragraph.add_run(part[1:-1])
            run.font.name = 'Courier New'
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(0, 0, 0) # Negro para código
        else:
            run = paragraph.add_run(part)
            if is_italic_only:
                run.italic = True

def convert_md_to_docx(md_path, docx_path):
    print(f"[INFO] Iniciando conversion academica de {md_path}...")
    if not os.path.exists(md_path):
        print(f"[ERROR] El archivo {md_path} no existe.")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = Document()
    
    # Configurar márgenes estándar de la página (2.54 cm)
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Configurar fuentes académicas estrictas (Times New Roman - Grayscale)
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(11)
    font.color.rgb = RGBColor(0, 0, 0) # Negro puro

    lines = content.split('\n')
    i = 0
    in_code_block = False
    in_mermaid_block = False
    code_lines = []
    mermaid_lines = []
    diagram_count = 0
    
    # Nombres de figuras correspondientes a su aparición
    figuras_names = [
        "Planificacion temporal del desarrollo del sistema (Diagrama de Gantt)",
        "Diagrama de Casos de Uso general del sistema Chess Legacy",
        "Modelo Conceptual Base de Datos Relacional (Diagrama Entidad-Relacion)",
        "Diagrama de Clases UML Simplificado (Arquitectura del Backend)",
        "Flujo interactivo de juego y analisis posicional (Diagrama de Secuencia UML)"
    ]

    while i < len(lines):
        line = lines[i]
        
        if not line.strip() and not in_code_block and not in_mermaid_block:
            i += 1
            continue
            
        # Detectar bloques de código
        if line.strip().startswith('```'):
            if in_mermaid_block:
                in_mermaid_block = False
                diagram_count += 1
                img_name = f"diagrama_{diagram_count}.png"
                img_path = os.path.join(os.path.dirname(docx_path), img_name)
                
                # Descargar e insertar la imagen PNG en lugar de texto
                mermaid_code = '\n'.join(mermaid_lines)
                if download_mermaid_diagram(mermaid_code, img_path):
                    p_img = doc.add_paragraph()
                    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_img.paragraph_format.space_before = Pt(12)
                    p_img.paragraph_format.space_after = Pt(4)
                    run_img = p_img.add_run()
                    run_img.add_picture(img_path, width=Inches(6.0))
                    
                    # Añadir pie de figura académico y sobrio (APA)
                    p_cap = doc.add_paragraph()
                    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_cap.paragraph_format.space_after = Pt(12)
                    p_cap.paragraph_format.keep_with_next = True
                    run_cap = p_cap.add_run(f"Figura 4.{diagram_count}. {figuras_names[diagram_count - 1]}.")
                    run_cap.font.name = 'Times New Roman'
                    run_cap.font.size = Pt(9.5)
                    run_cap.font.italic = True
                    run_cap.font.color.rgb = RGBColor(80, 80, 80)
                else:
                    # Si falla la descarga, insertar como bloque de código ordinario
                    p = doc.add_paragraph()
                    p.paragraph_format.left_indent = Inches(0.5)
                    run = p.add_run(mermaid_code)
                    run.font.name = 'Courier New'
                    run.font.size = Pt(9.5)
                
                mermaid_lines = []
            elif in_code_block:
                in_code_block = False
                p = doc.add_paragraph()
                p.paragraph_format.left_indent = Inches(0.5)
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(6)
                
                run = p.add_run('\n'.join(code_lines))
                run.font.name = 'Courier New'
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(0, 0, 0)
                
                pBdr = OxmlElement('w:pBdr')
                left = OxmlElement('w:left')
                left.set(qn('w:val'), 'single')
                left.set(qn('w:sz'), '12') # Fino
                left.set(qn('w:space'), '4')
                left.set(qn('w:color'), '888888')
                pBdr.append(left)
                p._p.get_or_add_pPr().append(pBdr)
                
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="FAFAFA"/>')
                p._p.get_or_add_pPr().append(shd)

                code_lines = []
            else:
                if line.strip().startswith('```mermaid'):
                    in_mermaid_block = True
                else:
                    in_code_block = True
            i += 1
            continue

        if in_mermaid_block:
            mermaid_lines.append(line)
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Encabezados Académicos (Negro Puro, Times New Roman, Sobrios)
        if line.startswith('# '):
            p = doc.add_heading(level=1)
            p.paragraph_format.space_before = Pt(24)
            p.paragraph_format.space_after = Pt(12)
            p.paragraph_format.keep_with_next = True
            
            # Formatear título sin emojis
            clean_title = strip_emojis(line[2:])
            run = p.add_run(clean_title)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(18)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0, 0, 0) # Negro Puro
            
        elif line.startswith('## '):
            p = doc.add_heading(level=2)
            p.paragraph_format.space_before = Pt(18)
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.keep_with_next = True
            
            clean_title = strip_emojis(line[3:])
            run = p.add_run(clean_title)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0, 0, 0) # Negro Puro
            
        elif line.startswith('### '):
            p = doc.add_heading(level=3)
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            
            clean_title = strip_emojis(line[4:])
            run = p.add_run(clean_title)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0, 0, 0) # Negro Puro
            
        # Citas Académicas (APA Blockquote — Indentación y Cursiva, sin cajas de colores)
        elif line.startswith('> '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.left_indent = Inches(0.5)
            p.paragraph_format.right_indent = Inches(0.5)
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(8)
            
            text_content = line[2:]
            text_content = re.sub(r'^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*', '', text_content)
            
            add_inline_formatting(p, text_content, is_italic_only=True)
            
        # Bullets
        elif line.strip().startswith('* ') or line.strip().startswith('- '):
            indent_level = len(line) - len(line.lstrip())
            text_content = line.lstrip()[2:]
            
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.left_indent = Inches(0.25 * (indent_level // 2 + 1))
            p.paragraph_format.space_after = Pt(4)
            
            add_inline_formatting(p, text_content)
            
        # Listas Ordenadas
        elif re.match(r'^\d+\.\-?\s+', line.strip()):
            match = re.match(r'^(\d+\.\-?\s+)(.*)', line.strip())
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_after = Pt(4)
            add_inline_formatting(p, match.group(2))

        # Tablas de Estilo Científico (APA / IEEE — Sin fondo de color, solo líneas horizontales)
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
                word_table.alignment = WD_ALIGN_PARAGRAPH.CENTER
                word_table.autofit = True
                
                for r_idx, row_data in enumerate(cleaned_rows):
                    row = word_table.add_row()
                    for c_idx, cell_value in enumerate(row_data):
                        if c_idx < len(row.cells):
                            cell = row.cells[c_idx]
                            cell.text = ""
                            p = cell.paragraphs[0]
                            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                            p.paragraph_format.space_after = Pt(4)
                            p.paragraph_format.space_before = Pt(4)
                            
                            add_inline_formatting(p, cell_value)
                            set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
                            
                            # Estilo de Borde APA
                            if r_idx == 0:
                                # Cabecera: Línea arriba y abajo
                                set_cell_borders_apa(cell, top=True, bottom=True)
                                for run in p.runs:
                                    run.bold = True
                            elif r_idx == len(cleaned_rows) - 1:
                                # Última fila: Línea abajo
                                set_cell_borders_apa(cell, bottom=True)
                            else:
                                # Filas intermedias: Sin bordes
                                set_cell_borders_apa(cell)
                doc.add_paragraph()
            continue

        elif line.strip() == '---':
            doc.add_page_break()

        # Párrafo Normal (Justificado con interlineado académico)
        else:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.line_spacing = 1.15
            add_inline_formatting(p, line)
            
        i += 1

    print(f"[INFO] Guardando archivo Word academico en: {docx_path}...")
    doc.save(docx_path)
    print("[SUCCESS] Conversion academica completada con exito total!")

if __name__ == '__main__':
    default_md = os.path.join(os.path.dirname(__file__), "DOCUMENTACION_COMPLETA.md")
    default_docx = os.path.join(os.path.dirname(__file__), "DOCUMENTACION_COMPLETA.docx")
    
    convert_md_to_docx(default_md, default_docx)
