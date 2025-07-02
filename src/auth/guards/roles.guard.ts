import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no se especifican roles, permitir acceso
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.rol) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    const hasRole = requiredRoles.some(role => user.rol.nombre === role);
    
    if (!hasRole) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    return true;
  }
}