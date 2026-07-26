1. 安装 git

2. GitHub 创建仓库
	 保持 Public，不要勾选 README，直接点击 **Create repository**

3. 下载 Nolebase 模板

	url：https://github.com/nolebase/nolebase

	将nolebase文件夹中的内容复制到 my_blog 文件夹（存放博客文件的位置）

4. 初始化仓库

	```bash
	# 1. 进入你刚才设置的 Obsidian 仓库路径（如果路径不同，请改成你自己的）
	cd D:\xxx\xxx\my_blog
	
	# 2. 初始化 Git 仓库（让这个文件夹变成受 Git 管理的仓库）
	git init
	
	# 3. 关联到你的 Gitee 远程仓库（把 YOUR_USERNAME 和 REPO_NAME 换成你实际的名字），前提 gitee与github镜像同步
	git remote add origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git      # 添加远程地址
	git remote set-url origin https://gitee.com/YOUR_USERNAME/REPO_NAME.git  # 替换远程地址
	
	# 4. 验证一下是否关联成功（如果没报错就说明成功了）
	git remote -v
	
	# 5. 把本地分支强制改名为 main（和 GitHub 保持一致）
	git branch -M main
	```

5. 将模板文件推送到 GitHub 中

	```bash
	# 1. 添加所有新文件到 Git 队列
	git add .
	
	# 2. 提交更改，并写上备注（随便写，比如"放进去模板"）
	git commit -m "add blog template"
	
	# 3. 推送到 Gitee
	git push origin main
	```

6. 在 vercel 中新建项目

	url：https://vercel.com/

	- 进入官网点击 Start Deploying

	- 点击 Continue with GitHub使用 github 账号登录
	- 点击 Import 需要部署的仓库后的按钮
	- 设置信息：
		- Project Name：项目名
		- Framework Preset：框架预设（Vite）
		- Build and Output Settings -> Output Directory：`./vitepress/dist`
		- 点击 Deploy 部署

