# 🚀 Deployment Guide

## Deploy to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/dangduyminh109/algorithm-design-analysis)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables (Optional)

Set these in your Vercel dashboard under Settings > Environment Variables:

- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_DESCRIPTION`: Application description  
- `NEXT_PUBLIC_APP_URL`: Production URL
- `NODE_ENV`: Set to `production`

### Build Configuration

The project uses:
- **Framework**: Next.js 14
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

### Performance Optimizations

- Static export ready
- Image optimization
- Automatic code splitting
- Tree shaking enabled
- CSS optimization with Tailwind CSS

### Domain Configuration

After deployment, you can:
1. Add a custom domain in Vercel dashboard
2. Configure DNS records
3. SSL certificates are automatically provided

### Monitoring

- Build logs available in Vercel dashboard
- Runtime logs for debugging
- Analytics integration ready

---

## Other Deployment Options

### Netlify
```bash
npm run build
# Upload .next folder to Netlify
```

### GitHub Pages
```bash
npm run export
# Deploy 'out' folder to GitHub Pages
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
