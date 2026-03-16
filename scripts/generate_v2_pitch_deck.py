from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from textwrap import wrap
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageDraw, ImageFont


ROOT = Path("/Users/zhouhao/Documents/AI_APP/03-AICFO")
OUTPUT_DIR = ROOT / "output" / "pitch-deck-assets"
SLIDES_DIR = OUTPUT_DIR / "slides"
SCREENS_DIR = OUTPUT_DIR / "screens"
PPTX_PATH = ROOT / "output" / "school-finance-v2-client-pitch.pptx"

SLIDE_W, SLIDE_H = 1600, 900
PHONE_W, PHONE_H = 440, 900
EMU_W, EMU_H = 12192000, 6858000


def ensure_dirs() -> None:
    for path in (OUTPUT_DIR, SLIDES_DIR, SCREENS_DIR, PPTX_PATH.parent):
        path.mkdir(parents=True, exist_ok=True)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        [
            "/System/Library/Fonts/STHeiti Medium.ttc",
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        ]
        if bold
        else [
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/System/Library/Fonts/STHeiti Light.ttc",
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        ]
    )
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except Exception:
            continue
    return ImageFont.load_default()


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_label(draw, xy, text, size=20, fill="#5B6577", bold=False):
    draw.text(xy, text, font=font(size, bold), fill=fill)


def draw_multiline(draw, box, text, size=28, fill="#111827", bold=False, line_gap=10):
    x, y, w, _ = box
    chars = max(8, int(w / (size * 0.8)))
    lines = []
    for paragraph in text.split("\n"):
        lines.extend(wrap(paragraph, width=chars) or [""])
    cursor = y
    for line in lines:
        draw.text((x, cursor), line, font=font(size, bold), fill=fill)
        cursor += size + line_gap
    return cursor


def make_canvas() -> Image.Image:
    img = Image.new("RGB", (SLIDE_W, SLIDE_H), "#F5F7FB")
    draw = ImageDraw.Draw(img)
    draw.ellipse((1080, -160, 1620, 320), fill="#DCE8FF")
    draw.ellipse((-120, 650, 420, 1100), fill="#E6EEFf")
    draw.rounded_rectangle((60, 60, 1540, 840), radius=42, fill="#FBFCFE")
    return img


def phone_shell() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (PHONE_W, PHONE_H), "#F6F8FC")
    draw = ImageDraw.Draw(img)
    rounded(draw, (10, 10, PHONE_W - 10, PHONE_H - 10), 56, "#111827")
    rounded(draw, (28, 28, PHONE_W - 28, PHONE_H - 28), 44, "#F3F6FB")
    draw.ellipse((220, 20, 470, 220), fill="#DBEAFE")
    draw.ellipse((-40, 620, 210, 920), fill="#E8F0FF")
    rounded(draw, (160, 22, 280, 40), 10, "#0F172A")
    return img, draw


def chip(draw, box, text, active=False, outlined=False):
    bg = "#2F6BFF" if active else "#FFFFFF"
    border = "#2F6BFF" if active else "#D7DEEA"
    if outlined:
      bg = "#F7FAFF"
      border = "#AFC4FF"
    rounded(draw, box, 20, bg, border, 2)
    text_fill = "#FFFFFF" if active else "#334155"
    bbox = draw.textbbox((0, 0), text, font=font(18, True))
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x1, y1, x2, y2 = box
    draw.text(
        ((x1 + x2 - tw) / 2, (y1 + y2 - th) / 2 - 2),
        text,
        font=font(18, True),
        fill=text_fill,
    )


def small_card(draw, box, title, value, accent="#2F6BFF"):
    rounded(draw, box, 26, "#FFFFFF", "#E2E8F0", 2)
    x1, y1, x2, _ = box
    rounded(draw, (x1 + 18, y1 + 18, x1 + 50, y1 + 50), 16, "#EEF4FF")
    draw.rectangle((x1 + 28, y1 + 28, x1 + 40, y1 + 40), fill=accent)
    draw_label(draw, (x1 + 18, y1 + 64), title, size=17, fill="#64748B")
    draw_label(draw, (x1 + 18, y1 + 95), value, size=30, fill="#0F172A", bold=True)


def draw_bar_list(draw, start_x, start_y, items):
    cursor = start_y
    for name, value, color in items:
        draw_label(draw, (start_x, cursor), name, size=18, fill="#334155")
        draw_label(draw, (start_x + 250, cursor), value, size=18, fill="#64748B")
        rounded(draw, (start_x, cursor + 34, start_x + 290, cursor + 50), 8, "#E8EDF6")
        ratio = min(1, int(value.strip("%")) / 100 if value.endswith("%") else float(value) / 100)
        rounded(draw, (start_x, cursor + 34, start_x + int(290 * ratio), cursor + 50), 8, color)
        cursor += 82


def financial_screen() -> Path:
    img, draw = phone_shell()
    draw_label(draw, (54, 70), "财务分析", size=34, fill="#0F172A", bold=True)
    rounded(draw, (280, 64, 386, 108), 18, "#FFFFFF", "#D7DEEA", 2)
    draw_label(draw, (302, 77), "本年", size=18, fill="#334155", bold=True)
    draw.polygon([(360, 84), (374, 84), (367, 94)], fill="#64748B")

    rounded(draw, (46, 128, 394, 186), 28, "#E8EDF5", "#DCE4F0", 1)
    chip(draw, (56, 138, 218, 176), "财务分析", active=True)
    chip(draw, (228, 138, 384, 176), "校长治理")

    chip(draw, (54, 214, 176, 254), "内控风险", active=True)
    chip(draw, (186, 214, 308, 254), "报销分析")

    draw_label(draw, (54, 286), "AI 内控总览", size=30, fill="#0F172A", bold=True)
    draw_label(draw, (240, 292), "从审批提示沉淀为管理报告", size=16, fill="#64748B")

    small_card(draw, (54, 336, 206, 498), "本年核查单量", "4286")
    small_card(draw, (228, 336, 380, 498), "风险命中单量", "618", accent="#F97316")

    rounded(draw, (54, 524, 386, 726), 30, "#FFFFFF", "#E2E8F0", 2)
    draw_label(draw, (76, 548), "五大风险主题占比", size=22, fill="#0F172A", bold=True)
    colors = ["#2F6BFF", "#18B47A", "#F97316", "#7C5CFF", "#13B5B1"]
    center = (128, 640)
    angles = [70, 55, 45, 35, 55]
    start = 0
    for angle, color in zip(angles, colors):
        draw.pieslice((72, 584, 184, 696), start=start, end=start + angle, fill=color)
        draw.pieslice((90, 602, 166, 678), start=start, end=start + angle, fill="#FFFFFF")
        start += angle + 6
    draw_label(draw, (102, 622), "风险", size=18, fill="#64748B")
    draw_label(draw, (100, 648), "618", size=34, fill="#0F172A", bold=True)
    draw_bar_list(
        draw,
        210,
        582,
        [
            ("票据与凭证完整性", "30%", "#2F6BFF"),
            ("金额与标准合规", "24%", "#18B47A"),
            ("合同与时序合规", "20%", "#F97316"),
        ],
    )

    rounded(draw, (54, 748, 386, 846), 26, "#F2F7FF", "#D6E4FF", 2)
    chip(draw, (76, 766, 152, 796), "价值", active=True)
    draw_multiline(
        draw,
        (76, 804, 292, 40),
        "把单据级风险提示沉淀成校长和财务负责人可读的内控报告。",
        size=16,
        fill="#334155",
    )

    path = SCREENS_DIR / "financial-screen.png"
    img.save(path)
    return path


def governance_screen() -> Path:
    img, draw = phone_shell()
    draw_label(draw, (54, 70), "校长治理", size=34, fill="#0F172A", bold=True)
    rounded(draw, (46, 128, 394, 186), 28, "#E8EDF5", "#DCE4F0", 1)
    chip(draw, (56, 138, 218, 176), "财务分析")
    chip(draw, (228, 138, 384, 176), "校长治理", active=True)

    for i, txt in enumerate(["总览", "学生", "基层", "教师"]):
        x = 54 + i * 86
        chip(draw, (x, 214, x + 72, 252), txt, outlined=True if i == 0 else False)

    draw_label(draw, (54, 286), "可治理资金总览", size=30, fill="#0F172A", bold=True)
    draw_label(draw, (286, 292), "主口径：可治理支出池", size=16, fill="#64748B")
    small_card(draw, (54, 336, 154, 486), "可治理资金", "760万")
    small_card(draw, (170, 336, 270, 486), "占总支出", "38%", accent="#18B47A")
    small_card(draw, (286, 336, 386, 486), "资源主分类", "6类", accent="#7C5CFF")

    rounded(draw, (54, 514, 386, 760), 30, "#FFFFFF", "#E2E8F0", 2)
    draw_label(draw, (76, 538), "这些可治理的钱，主要花到哪里了", size=22, fill="#0F172A", bold=True)
    center = (124, 660)
    values = [0.38, 0.17, 0.13, 0.1, 0.08, 0.14]
    colors = ["#2F6BFF", "#18B47A", "#F97316", "#13B5B1", "#7C5CFF", "#94A3B8"]
    start = 0
    for ratio, color in zip(values, colors):
        angle = 360 * ratio
        draw.pieslice((68, 604, 180, 716), start=start, end=start + angle, fill=color)
        draw.pieslice((86, 622, 162, 698), start=start, end=start + angle, fill="#FFFFFF")
        start += angle + 4
    draw_bar_list(
        draw,
        205,
        590,
        [
            ("学生成长与学习支持", "38%", "#2F6BFF"),
            ("教师发展与激励", "17%", "#18B47A"),
            ("组织运行与行政统筹", "13%", "#F97316"),
        ],
    )

    rounded(draw, (54, 782, 386, 846), 24, "#ECFDF4", "#CDEFD9", 2)
    chip(draw, (76, 796, 152, 826), "价值", active=True)
    draw_multiline(
        draw,
        (162, 796, 220, 32),
        "让校长直接看清可治理的钱是否真正下沉到学生、基层与教师。",
        size=15,
        fill="#334155",
    )

    path = SCREENS_DIR / "governance-screen.png"
    img.save(path)
    return path


def mapping_screen() -> Path:
    img, draw = phone_shell()
    draw_label(draw, (54, 70), "规则映射确认单", size=32, fill="#0F172A", bold=True)
    rounded(draw, (54, 126, 386, 178), 20, "#FFF4F2", "#F4C7C1", 2)
    draw_multiline(
        draw,
        (72, 140, 296, 30),
        "红字提示：每条规则必须唯一归一个风险主题，不允许双归类。",
        size=16,
        fill="#B42318",
        bold=True,
    )
    draw_label(draw, (54, 208), "待确认项", size=24, fill="#0F172A", bold=True)
    items = [
        ("1025 编码问题", "待确认"),
        ("1026 编码问题", "待确认"),
        ("业务类型主数据口径", "待确认"),
    ]
    y = 246
    for left, right in items:
        rounded(draw, (54, y, 386, y + 78), 22, "#FFFFFF", "#E2E8F0", 2)
        draw_label(draw, (74, y + 18), left, size=18, fill="#334155", bold=True)
        rounded(draw, (292, y + 18, 366, y + 52), 16, "#FFF7ED", "#FED7AA", 2)
        draw_label(draw, (308, y + 27), right, size=14, fill="#C2410C", bold=True)
        y += 92

    draw_label(draw, (54, 548), "唯一映射示例", size=24, fill="#0F172A", bold=True)
    table_y = 586
    for row in [
        ("1004", "发票购买方一致性", "一致性与真实性"),
        ("1018", "预算项经济科目一致性", "预算与指标合规"),
        ("1020", "培训报销标准", "金额与标准合规"),
    ]:
        rounded(draw, (54, table_y, 386, table_y + 64), 18, "#FFFFFF", "#E2E8F0", 2)
        draw_label(draw, (70, table_y + 16), row[0], size=16, fill="#2F6BFF", bold=True)
        draw_multiline(draw, (124, table_y + 12, 120, 24), row[1], size=14, fill="#334155")
        draw_multiline(draw, (266, table_y + 12, 92, 24), row[2], size=14, fill="#111827", bold=True)
        table_y += 76

    path = SCREENS_DIR / "mapping-screen.png"
    img.save(path)
    return path


@dataclass
class Slide:
    title: str
    eyebrow: str
    body: list[str]
    accent: str
    screenshot: Path
    footer: str


def paste_phone(base: Image.Image, phone_path: Path, box):
    phone = Image.open(phone_path).convert("RGB")
    phone.thumbnail((box[2] - box[0], box[3] - box[1]))
    x = box[0] + (box[2] - box[0] - phone.width) // 2
    y = box[1] + (box[3] - box[1] - phone.height) // 2
    shadow = Image.new("RGBA", (phone.width + 36, phone.height + 36), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((18, 18, phone.width + 18, phone.height + 18), 54, fill=(15, 23, 42, 40))
    base.paste(shadow, (x - 18, y - 10), shadow)
    base.paste(phone, (x, y))


def build_slide_image(idx: int, slide: Slide):
    img = make_canvas()
    draw = ImageDraw.Draw(img)

    draw_label(draw, (120, 120), slide.eyebrow, size=22, fill=slide.accent, bold=True)
    draw_multiline(draw, (120, 158, 580, 60), slide.title, size=54, fill="#0F172A", bold=True, line_gap=8)

    card = (104, 290, 760, 780)
    rounded(draw, card, 36, "#FFFFFF", "#E5EAF3", 2)
    draw_label(draw, (136, 326), "核心价值", size=22, fill=slide.accent, bold=True)
    y = 382
    for bullet in slide.body:
        rounded(draw, (136, y + 10, 148, y + 22), 6, slide.accent)
        y = draw_multiline(draw, (168, y, 520, 24), bullet, size=26, fill="#334155", line_gap=8) + 14

    draw_label(draw, (136, 692), "关键应用名称", size=18, fill="#64748B")
    draw_label(draw, (136, 722), "学校财务移动 H5 V2", size=28, fill="#111827", bold=True)
    draw_label(draw, (136, 764), slide.footer, size=18, fill="#64748B")

    rounded(draw, (850, 120, 1460, 780), 42, "#EEF4FF", "#DDE7FB", 2)
    draw_label(draw, (894, 158), "关键界面截图示例", size=24, fill="#0F172A", bold=True)
    paste_phone(img, slide.screenshot, (930, 214, 1380, 760))

    draw_label(draw, (120, 820), f"{idx:02d}", size=18, fill="#94A3B8", bold=True)
    draw_label(draw, (1360, 820), "Apple-inspired minimal pitch deck", size=16, fill="#94A3B8")

    path = SLIDES_DIR / f"slide-{idx}.png"
    img.save(path)
    return path


def cover_slide(financial_path: Path, governance_path: Path, mapping_path: Path) -> Path:
    img = Image.new("RGB", (SLIDE_W, SLIDE_H), "#F2F5FA")
    draw = ImageDraw.Draw(img)
    draw.ellipse((1040, -120, 1620, 420), fill="#DCE8FF")
    draw.ellipse((-220, 560, 380, 1120), fill="#EAF0FF")
    rounded(draw, (70, 70, 1530, 830), 48, "#FBFCFE")

    draw_label(draw, (130, 126), "客户汇报草案", size=22, fill="#2F6BFF", bold=True)
    draw_multiline(draw, (130, 170, 620, 60), "学校财务移动 H5 V2\n需求确认与初步设计方案", size=62, fill="#0F172A", bold=True, line_gap=10)
    draw_multiline(
        draw,
        (130, 352, 560, 44),
        "围绕“财务分析 + 校长治理”双视角，展示最新的内控分析、治理看板与规则映射底座。",
        size=28,
        fill="#475569",
        line_gap=12,
    )

    for i, txt in enumerate(["Apple Minimal", "企业微信/钉钉 H5", "AI 内控分析", "校长治理视角"]):
        x = 130 + (i % 2) * 170
        y = 500 + (i // 2) * 58
        chip(draw, (x, y, x + 150, y + 40), txt, outlined=True)

    for idx, screenshot in enumerate([financial_path, governance_path, mapping_path]):
        box = (820 + idx * 190, 140 + idx * 40, 980 + idx * 190, 500 + idx * 40)
        rounded(draw, box, 30, "#EAF0FF", "#D9E4FA", 2)
        phone = Image.open(screenshot).convert("RGB")
        phone.thumbnail((box[2] - box[0] - 20, box[3] - box[1] - 20))
        px = box[0] + (box[2] - box[0] - phone.width) // 2
        py = box[1] + (box[3] - box[1] - phone.height) // 2
        img.paste(phone, (px, py))

    draw_label(draw, (130, 760), "汇报对象：目标客户 / 校长 / 财务负责人", size=18, fill="#64748B")
    draw_label(draw, (1180, 760), datetime.now().strftime("%Y.%m.%d"), size=18, fill="#64748B")

    path = SLIDES_DIR / "slide-1.png"
    img.save(path)
    return path


def make_slides() -> list[Path]:
    financial = financial_screen()
    governance = governance_screen()
    mapping = mapping_screen()
    slides = [cover_slide(financial, governance, mapping)]

    slide_specs = [
        Slide(
            title="方案总览\n双视角合一的移动端经营看板",
            eyebrow="OVERVIEW",
            body=[
                "财务分析聚焦 AI 内控风险和报销结构，帮助财务负责人从审批提示走向管理报告。",
                "校长治理聚焦可治理资金、资源下沉、基层活力与教师成长，帮助校长判断钱是否花在离学生最近的地方。",
                "两套能力在同一移动 H5 内切换，减少学习成本，适合企业微信或钉钉内嵌场景。",
            ],
            accent="#2F6BFF",
            screenshot=governance,
            footer="双视角统一入口，便于销售演示与客户确认。",
        ),
        Slide(
            title="应用一\n财务分析",
            eyebrow="FINANCIAL ANALYSIS",
            body=[
                "默认以本年口径打开，并支持标题右侧一键切换本季 / 本月，节约首屏空间。",
                "内控风险与报销分析采用统一二级主题切换，既能看支出画像，也能看制度薄弱点、风险集中和闭环效率。",
                "页面内所有结论都使用校长和财务负责人可读的业务语言，而不是后台规则术语。",
            ],
            accent="#2F6BFF",
            screenshot=financial,
            footer="核心价值：把 AI 审批提示沉淀为经营和内控看板。",
        ),
        Slide(
            title="应用二\n校长治理",
            eyebrow="PRINCIPAL GOVERNANCE",
            body=[
                "默认聚焦可治理支出池，不再用全口径总支出稀释治理判断。",
                "围绕可治理资金总览、离学生最近的资源、基层活力、教师成长与激励四个模块组织页面。",
                "首屏极简，只保留标题、一级切换和页内导航，解释性内容通过首次引导和帮助入口承接。",
            ],
            accent="#18B47A",
            screenshot=governance,
            footer="核心价值：让校长一眼看清钱是否真正下沉到学生、基层与教师。",
        ),
        Slide(
            title="规则与数据底座\n让前端展示与后端口径彻底对齐",
            eyebrow="RULE MAPPING",
            body=[
                "建立“一条规则唯一归属一个风险主题”的映射底座，避免高频主题排行和风险占比出现遗漏与歧义。",
                "业务维度直接使用系统业务类型，如货物类、服务类、代发劳务费、参加培训/会议、租车费等。",
                "对整改效率、低闭环单位等指标，已在 PRD 开篇红字明确列出单据侧必须补齐的数据字段。",
            ],
            accent="#F97316",
            screenshot=mapping,
            footer="核心价值：先固化规则口径，再接后端接口，减少返工。",
        ),
        Slide(
            title="明日沟通建议\n先确认需求，再进入开发排期",
            eyebrow="NEXT STEP",
            body=[
                "先让客户确认两大视角的信息架构是否成立，尤其是财务分析中的内控分析是否符合其管理语言。",
                "重点确认规则唯一映射、业务类型主数据、整改闭环所需字段这三块数据底座。",
                "若客户认可方向，再进入接口对齐、真实数据接入和视觉微调阶段。",
            ],
            accent="#7C5CFF",
            screenshot=financial,
            footer="建议明日汇报聚焦：价值、口径、数据准备、确认项。",
        ),
    ]

    for idx, spec in enumerate(slide_specs, start=2):
        slides.append(build_slide_image(idx, spec))
    return slides


def xml_header() -> str:
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'


def content_types(slide_count: int) -> str:
    overrides = [
        ('/ppt/presentation.xml', 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'),
        ('/ppt/slideMasters/slideMaster1.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml'),
        ('/ppt/slideLayouts/slideLayout1.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml'),
        ('/ppt/theme/theme1.xml', 'application/vnd.openxmlformats-officedocument.theme+xml'),
        ('/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'),
        ('/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml'),
    ]
    for i in range(1, slide_count + 1):
        overrides.append((f'/ppt/slides/slide{i}.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml'))
    parts = "\n".join(
        f'  <Override PartName="{name}" ContentType="{ctype}"/>'
        for name, ctype in overrides
    )
    return f"""{xml_header()}
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
{parts}
</Types>"""


def rels_root() -> str:
    return f"""{xml_header()}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""


def app_xml(slide_count: int) -> str:
    return f"""{xml_header()}
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
  <Slides>{slide_count}</Slides>
  <Notes>0</Notes>
  <HiddenSlides>0</HiddenSlides>
  <MMClips>0</MMClips>
  <PresentationFormat>On-screen Show (16:9)</PresentationFormat>
  <Company>OpenAI</Company>
  <AppVersion>1.0</AppVersion>
</Properties>"""


def core_xml() -> str:
    created = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return f"""{xml_header()}
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>学校财务移动 H5 V2 客户汇报</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{created}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{created}</dcterms:modified>
</cp:coreProperties>"""


def presentation_xml(slide_count: int) -> str:
    slide_ids = "\n".join(
        f'    <p:sldId id="{255 + i}" r:id="rId{i + 1}"/>' for i in range(1, slide_count + 1)
    )
    return f"""{xml_header()}
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
{slide_ids}
  </p:sldIdLst>
  <p:sldSz cx="{EMU_W}" cy="{EMU_H}"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>"""


def presentation_rels(slide_count: int) -> str:
    rels = ['  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>']
    for i in range(1, slide_count + 1):
        rels.append(f'  <Relationship Id="rId{i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>')
    return f"""{xml_header()}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{chr(10).join(rels)}
</Relationships>"""


def slide_master_xml() -> str:
    return f"""{xml_header()}
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld name="Master">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId1"/>
  </p:sldLayoutIdLst>
  <p:txStyles>
    <p:titleStyle/>
    <p:bodyStyle/>
    <p:otherStyle/>
  </p:txStyles>
</p:sldMaster>"""


def slide_master_rels() -> str:
    return f"""{xml_header()}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>"""


def slide_layout_xml() -> str:
    return f"""{xml_header()}
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
  <p:cSld name="Blank">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>"""


def slide_layout_rels() -> str:
    return f"""{xml_header()}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>"""


def theme_xml() -> str:
    return f"""{xml_header()}
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Minimal Theme">
  <a:themeElements>
    <a:clrScheme name="Minimal">
      <a:dk1><a:srgbClr val="111827"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="334155"/></a:dk2>
      <a:lt2><a:srgbClr val="F8FAFC"/></a:lt2>
      <a:accent1><a:srgbClr val="2F6BFF"/></a:accent1>
      <a:accent2><a:srgbClr val="18B47A"/></a:accent2>
      <a:accent3><a:srgbClr val="F97316"/></a:accent3>
      <a:accent4><a:srgbClr val="7C5CFF"/></a:accent4>
      <a:accent5><a:srgbClr val="13B5B1"/></a:accent5>
      <a:accent6><a:srgbClr val="94A3B8"/></a:accent6>
      <a:hlink><a:srgbClr val="2563EB"/></a:hlink>
      <a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Minimal">
      <a:majorFont>
        <a:latin typeface="Helvetica"/>
        <a:ea typeface="PingFang SC"/>
        <a:cs typeface="Arial"/>
      </a:majorFont>
      <a:minorFont>
        <a:latin typeface="Helvetica"/>
        <a:ea typeface="PingFang SC"/>
        <a:cs typeface="Arial"/>
      </a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Minimal">
      <a:fillStyleLst>
        <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/></a:schemeClr></a:gs>
            <a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="103000"/><a:satMod val="103000"/></a:schemeClr></a:gs>
          </a:gsLst>
          <a:lin ang="5400000" scaled="0"/>
        </a:gradFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/></a:schemeClr></a:gs>
            <a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/></a:schemeClr></a:gs>
            <a:gs pos="100000"><a:schemeClr val="phClr"><a:satMod val="120000"/><a:lumMod val="99000"/></a:schemeClr></a:gs>
          </a:gsLst>
          <a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>
        </a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>
        <a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>
        <a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle><a:effectLst/></a:effectStyle>
        <a:effectStyle><a:effectLst/></a:effectStyle>
        <a:effectStyle><a:effectLst/></a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
        <a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs>
            <a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs>
            <a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs>
          </a:gsLst>
          <a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>
        </a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
  <a:extraClrSchemeLst/>
</a:theme>"""


def slide_xml(rel_id: str = "rId2") -> str:
    return f"""{xml_header()}
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="Slide Image"/>
          <p:cNvPicPr/>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="{rel_id}"/>
          <a:stretch><a:fillRect/></a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="{EMU_W}" cy="{EMU_H}"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""


def slide_rels(idx: int) -> str:
    return f"""{xml_header()}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/slide-image-{idx}.png"/>
</Relationships>"""


def write_pptx(slide_images: list[Path]) -> None:
    with ZipFile(PPTX_PATH, "w", compression=ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types(len(slide_images)))
        zf.writestr("_rels/.rels", rels_root())
        zf.writestr("docProps/app.xml", app_xml(len(slide_images)))
        zf.writestr("docProps/core.xml", core_xml())
        zf.writestr("ppt/presentation.xml", presentation_xml(len(slide_images)))
        zf.writestr("ppt/_rels/presentation.xml.rels", presentation_rels(len(slide_images)))
        zf.writestr("ppt/slideMasters/slideMaster1.xml", slide_master_xml())
        zf.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", slide_master_rels())
        zf.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout_xml())
        zf.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", slide_layout_rels())
        zf.writestr("ppt/theme/theme1.xml", theme_xml())

        for idx, path in enumerate(slide_images, start=1):
            zf.writestr(f"ppt/slides/slide{idx}.xml", slide_xml())
            zf.writestr(f"ppt/slides/_rels/slide{idx}.xml.rels", slide_rels(idx))
            zf.write(path, arcname=f"ppt/media/slide-image-{idx}.png")


def main():
    ensure_dirs()
    slide_images = make_slides()
    write_pptx(slide_images)
    print(f"Generated PPTX: {PPTX_PATH}")


if __name__ == "__main__":
    main()
