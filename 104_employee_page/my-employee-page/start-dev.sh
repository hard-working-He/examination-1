#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息函数
print_info() {
    echo -e "${BLUE}[INFO]${NC} ℹ️  $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} ✅ $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} ⚠️  $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} ❌ $1"
}

# 检查是否在正确的目录
check_directory() {
    print_info "🔍 检查项目目录..."
    if [ ! -f "package.json" ]; then
        print_error "未找到 package.json 文件，请确保在项目根目录下运行此脚本"
        exit 1
    fi
    
    if [ ! -f "next.config.ts" ]; then
        print_error "未找到 next.config.ts 文件，请确保这是一个 Next.js 项目"
        exit 1
    fi
    
    print_success "目录检查通过"
}

# 检查 Node.js 版本
check_node_version() {
    print_info "🟢 检查 Node.js 版本..."
    if ! command -v node &> /dev/null; then
        print_error "未安装 Node.js，请先安装 Node.js"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        print_warning "Node.js 版本过低，当前版本: $NODE_VERSION，推荐版本: $REQUIRED_VERSION 或更高"
    else
        print_success "Node.js 版本检查通过，当前版本: $NODE_VERSION"
    fi
}

# 检查 npm 版本
check_npm_version() {
    print_info "📦 检查 npm 版本..."
    if ! command -v npm &> /dev/null; then
        print_error "未安装 npm，请先安装 npm"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm 版本检查通过，当前版本: $NPM_VERSION"
}

# 检查端口是否被占用
check_port() {
    print_info "🌐 检查端口可用性..."
    PORT=${1:-3000}
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "端口 $PORT 已被占用"
        print_info "🔍 尝试查找可用端口..."
        
        for p in {3001..3010}; do
            if ! lsof -Pi :$p -sTCP:LISTEN -t >/dev/null 2>&1; then
                print_success "找到可用端口: $p"
                export PORT=$p
                break
            fi
        done
        
        if [ -z "$PORT" ]; then
            print_error "未找到可用端口，请手动关闭占用端口的进程"
            exit 1
        fi
    else
        print_success "端口 $PORT 可用"
    fi
}

# 清理旧的依赖和缓存
clean_environment() {
    print_info "🧹 清理环境..."
    
    if [ -d "node_modules" ]; then
        print_info "🗑️  删除旧的 node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        print_info "🗑️  删除旧的 package-lock.json..."
        rm -f package-lock.json
    fi
    
    print_info "🧽 清理 npm 缓存..."
    npm cache clean --force
    
    print_success "环境清理完成"
}

# 安装依赖
install_dependencies() {
    print_info "📥 正在安装依赖..."
    
    # 检查是否有 package-lock.json，如果有则使用 npm ci
    if [ -f "package-lock.json" ]; then
        print_info "⚡ 使用 npm ci 安装依赖（更快更可靠）..."
        if npm ci; then
            print_success "依赖安装完成！"
        else
            print_warning "npm ci 失败，尝试使用 npm install..."
            if npm install; then
                print_success "依赖安装完成！"
            else
                print_error "依赖安装失败"
                exit 1
            fi
        fi
    else
        print_info "📦 使用 npm install 安装依赖..."
        if npm install; then
            print_success "依赖安装完成！"
        else
            print_error "依赖安装失败"
            exit 1
        fi
    fi
}

# 检查依赖完整性
verify_dependencies() {
    print_info "🔍 验证依赖完整性..."
    
    if [ ! -d "node_modules" ]; then
        print_error "node_modules 目录不存在，依赖安装可能失败"
        exit 1
    fi
    
    # 检查关键依赖是否存在
    if [ ! -d "node_modules/next" ]; then
        print_error "Next.js 依赖缺失"
        exit 1
    fi
    
    if [ ! -d "node_modules/react" ]; then
        print_error "React 依赖缺失"
        exit 1
    fi
    
    print_success "依赖完整性验证通过"
}

# 启动开发服务器
start_dev_server() {
    print_info "🚀 正在启动开发服务器..."
    
    # 设置环境变量
    export NODE_ENV=development
    
    # 启动开发服务器
    if npm run dev; then
        print_success "开发服务器启动成功！"
        print_info "🌐 访问地址: http://localhost:${PORT:-3000}"
        print_info "⏹️  按 Ctrl+C 停止服务器"
    else
        print_error "开发服务器启动失败"
        exit 1
    fi
}

# 主函数
main() {
    print_info "🎯 === Next.js 项目启动脚本 ==="
    print_info "🚀 开始检查和启动项目..."
    
    # 执行检查步骤
    check_directory
    check_node_version
    check_npm_version
    check_port
    
    # 询问是否清理环境
    echo
    print_info "🧹 是否清理环境并重新安装依赖？"
    read -p "输入 y 清理环境，直接回车跳过 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        clean_environment
    else
        print_info "跳过环境清理"
    fi
    
    # 安装依赖
    install_dependencies
    verify_dependencies
    
    # 启动服务器
    start_dev_server
}

# 错误处理
trap 'print_error "⏹️  脚本执行被中断"; exit 1' INT TERM

# 执行主函数
main "$@"