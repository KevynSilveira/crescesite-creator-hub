"use client";

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RotateCcw, ZoomIn, ZoomOut, Check, X, Move } from "lucide-react";
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageFile: File) => void;
  fileName: string;
}

export function ImageCropModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  onCropComplete, 
  fileName 
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [processing, setProcessing] = useState(false);

  // Função para centralizar o crop quando a imagem carrega
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    
    // Criar crop centralizado e quadrado
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80, // 80% da largura da imagem
        },
        1, // aspect ratio 1:1 (quadrado)
        width,
        height,
      ),
      width,
      height,
    );
    
    setCrop(crop);
  }

  // Função para gerar a imagem cortada
  const getCroppedImg = useCallback(async (): Promise<File> => {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!image || !completedCrop || !ctx) {
      throw new Error('Erro ao processar imagem');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Definir tamanho do canvas (sempre 400x400 para avatar)
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Configurar qualidade do canvas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calcular dimensões do crop
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Aplicar transformações (rotação e escala)
    const centerX = outputSize / 2;
    const centerY = outputSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    // Desenhar a imagem cortada
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    ctx.restore();

    // Converter canvas para blob e depois para File
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Erro ao gerar imagem');
        }
        
        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        
        resolve(file);
      }, 'image/jpeg', 0.9); // 90% de qualidade
    });
  }, [completedCrop, scale, rotate, fileName]);

  const handleCropComplete = async () => {
    if (!completedCrop) {
      return;
    }

    setProcessing(true);
    try {
      const croppedFile = await getCroppedImg();
      onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error('Erro ao processar crop:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
    if (imgRef.current) {
      onImageLoad({ currentTarget: imgRef.current } as React.SyntheticEvent<HTMLImageElement>);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Move className="w-5 h-5 mr-2 text-cyan-400" />
            Ajustar Foto do Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Área de Crop */}
          <div className="flex justify-center bg-slate-800/50 rounded-lg p-4">
            <div className="max-w-lg max-h-96 overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1} // Forçar aspect ratio 1:1 (quadrado)
                minWidth={100}
                minHeight={100}
                circularCrop={false} // Manter retangular para melhor visualização
                className="max-w-full max-h-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop"
                  src={imageSrc}
                  style={{ 
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                  onLoad={onImageLoad}
                  className="block"
                />
              </ReactCrop>
            </div>
          </div>

          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zoom */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center">
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom: {Math.round(scale * 100)}%
              </Label>
              <Slider
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotação */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Rotação: {rotate}°
              </Label>
              <Slider
                value={[rotate]}
                onValueChange={(value) => setRotate(value[0])}
                min={-180}
                max={180}
                step={15}
                className="w-full"
              />
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-slate-800/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Como usar:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Arraste</strong> a área de seleção para posicionar o rosto</li>
              <li>• <strong>Redimensione</strong> puxando os cantos da seleção</li>
              <li>• <strong>Ajuste o zoom</strong> para enquadrar melhor</li>
              <li>• <strong>Gire a imagem</strong> se necessário</li>
              <li>• A área selecionada será sua foto de perfil</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-800"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleCropComplete}
              disabled={!completedCrop || processing}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Recorte
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}