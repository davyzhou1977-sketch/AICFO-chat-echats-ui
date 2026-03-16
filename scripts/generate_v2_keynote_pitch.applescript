on set_text_style(theItem, theSize, theFontName)
	tell application "Keynote"
		try
			set size of object text of theItem to theSize
			set font of object text of theItem to theFontName
		end try
	end tell
end set_text_style

on add_screenshot_label(theSlide, labelText, posX, posY)
	tell application "Keynote"
		tell theSlide
			set labelItem to make new text item with properties {object text:labelText, position:{posX, posY}, width:420, height:40}
			my set_text_style(labelItem, 24, "PingFang SC")
		end tell
	end tell
end add_screenshot_label

on add_screen(theSlide, imageAlias, posX, posY, imgWidth, imgHeight)
	tell application "Keynote"
		tell theSlide
			make new image with properties {file:imageAlias, position:{posX, posY}, width:imgWidth, height:imgHeight}
		end tell
	end tell
end add_screen

on add_content_slide(docRef, masterName, titleText, bodyText, appName, footerText, imageAlias)
	tell application "Keynote"
		tell docRef
			set newSlide to make new slide at end of slides with properties {base slide:master slide masterName}
			tell newSlide
				set object text of default title item to titleText
				set object text of default body item to bodyText & return & return & "关键应用名称" & return & appName & return & return & footerText
				my set_text_style(default title item, 42, "PingFang SC")
				my set_text_style(default body item, 23, "PingFang SC")
				my add_screenshot_label(newSlide, "关键界面截图示例", 1340, 128)
				my add_screen(newSlide, imageAlias, 1320, 178, 400, 818)
			end tell
		end tell
	end tell
end add_content_slide

set rootPath to "/Users/zhouhao/Documents/AI_APP/03-AICFO"
set outputPath to POSIX file (rootPath & "/output/school-finance-v2-client-pitch.key")
set financialImage to POSIX file (rootPath & "/output/pitch-deck-assets/screens/financial-screen.png")
set governanceImage to POSIX file (rootPath & "/output/pitch-deck-assets/screens/governance-screen.png")
set mappingImage to POSIX file (rootPath & "/output/pitch-deck-assets/screens/mapping-screen.png")

set overviewBody to "• 双视角统一入口：财务分析 + 校长治理，在同一移动 H5 中切换。" & return & "• 财务分析把 AI 审批提示沉淀成内控管理报告。" & return & "• 校长治理帮助校长判断资源是否真正下沉到学生、基层与教师。"
set financialBody to "• 默认本年打开，标题右侧下拉切换本季 / 本月，减少首屏占用。" & return & "• 内控风险与报销分析二级切换并存，既看支出画像，也看制度薄弱点和闭环效率。" & return & "• 所有图表和文案都改成管理语言，适合财务负责人和校长阅读。"
set governanceBody to "• 默认聚焦可治理支出池，不用全口径总支出稀释治理判断。" & return & "• 围绕可治理资金总览、离学生最近的资源、基层活力、教师成长与激励四个模块组织页面。" & return & "• 首屏极简，只保留标题、一级切换和页内导航，适配企业微信 / 钉钉 H5。"
set mappingBody to "• 已建立规则唯一映射底座，确保一条规则只归一个风险主题。" & return & "• 业务维度直接使用系统业务类型，如货物类、服务类、代发劳务费、参加培训/会议、租车费等。" & return & "• PRD 开篇已用红字注明整改闭环、低闭环单位等分析所需的单据字段。"
set nextBody to "• 明日先让客户确认两大视角的信息架构是否成立。" & return & "• 重点确认规则唯一映射、业务类型主数据、整改闭环字段三项数据底座。" & return & "• 客户认可方向后，再进入真实接口对齐、数据接入与视觉微调。"

tell application "Keynote"
	activate
	set d to make new document with properties {document theme:theme "现代风格"}
	set width of d to 1920
	set height of d to 1080

	tell current slide of d
		set object text of default title item to "学校财务移动 H5 V2"
		set object text of default body item to "目标客户汇报草案" & return & "需求确认与初步设计方案" & return & return & "核心价值：围绕“财务分析 + 校长治理”双视角，展示最新的内控分析、治理看板与规则映射底座。"
		my set_text_style(default title item, 52, "PingFang SC")
		my set_text_style(default body item, 24, "PingFang SC")
		my add_screenshot_label(current slide of d, "关键界面示意", 1230, 100)
		my add_screen(current slide of d, financialImage, 1130, 170, 250, 510)
		my add_screen(current slide of d, governanceImage, 1400, 140, 250, 510)
		my add_screen(current slide of d, mappingImage, 1270, 430, 230, 470)
	end tell

	my add_content_slide(d, "标题与项目符号", "方案总览", overviewBody, "学校财务移动 H5 V2", "核心价值：双视角统一入口，兼顾经营、治理与内控沟通。", governanceImage)
	my add_content_slide(d, "标题与项目符号", "应用一：财务分析", financialBody, "财务分析", "核心价值：把 AI 审批提示沉淀为经营和内控看板。", financialImage)
	my add_content_slide(d, "标题与项目符号", "应用二：校长治理", governanceBody, "校长治理", "核心价值：让校长一眼看清钱是否真正下沉到学生、基层与教师。", governanceImage)
	my add_content_slide(d, "标题与项目符号", "规则与数据底座", mappingBody, "规则映射确认", "核心价值：先固化规则口径，再接后端接口，减少返工。", mappingImage)
	my add_content_slide(d, "标题与项目符号", "明日沟通建议", nextBody, "客户确认重点", "建议先确认价值、口径与数据准备，再进入开发排期。", financialImage)

	save d in outputPath
end tell
