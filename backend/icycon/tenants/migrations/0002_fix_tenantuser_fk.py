from django.db import migrations


def recreate_tenantuser_forward(apps, schema_editor):
    vendor = schema_editor.connection.vendor
    if vendor == "sqlite":
        schema_editor.execute(
            '''
DROP TABLE IF EXISTS "tenants_tenantuser";
CREATE TABLE "tenants_tenantuser" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" varchar(20) NOT NULL,
    "tenant_id" bigint NOT NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED,
    "user_id" integer NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED
);
CREATE UNIQUE INDEX tenants_tenantuser_user_id_tenant_id_unique ON tenants_tenantuser(user_id, tenant_id);
'''
        )
    elif vendor == "postgresql":
        schema_editor.execute(
            '''
DROP TABLE IF EXISTS tenants_tenantuser CASCADE;
CREATE TABLE tenants_tenantuser (
    id BIGSERIAL PRIMARY KEY,
    role varchar(20) NOT NULL,
    tenant_id bigint NOT NULL REFERENCES tenants_tenant (id) DEFERRABLE INITIALLY DEFERRED,
    user_id integer NOT NULL REFERENCES users_user (id) DEFERRABLE INITIALLY DEFERRED
);
CREATE UNIQUE INDEX tenants_tenantuser_user_id_tenant_id_unique ON tenants_tenantuser(user_id, tenant_id);
'''
        )
    else:  # fallback: let Django handle auto field creation
        schema_editor.execute('DROP TABLE IF EXISTS tenants_tenantuser')


def recreate_tenantuser_reverse(apps, schema_editor):
    vendor = schema_editor.connection.vendor
    if vendor == "sqlite":
        schema_editor.execute(
            '''
DROP TABLE IF EXISTS "tenants_tenantuser";
CREATE TABLE "tenants_tenantuser" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" varchar(20) NOT NULL,
    "tenant_id" bigint NOT NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED,
    "user_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED
);
CREATE UNIQUE INDEX tenants_tenantuser_user_id_tenant_id_unique ON tenants_tenantuser(user_id, tenant_id);
'''
        )
    elif vendor == "postgresql":
        schema_editor.execute(
            '''
DROP TABLE IF EXISTS tenants_tenantuser CASCADE;
CREATE TABLE tenants_tenantuser (
    id BIGSERIAL PRIMARY KEY,
    role varchar(20) NOT NULL,
    tenant_id bigint NOT NULL REFERENCES tenants_tenant (id) DEFERRABLE INITIALLY DEFERRED,
    user_id integer NOT NULL REFERENCES auth_user (id) DEFERRABLE INITIALLY DEFERRED
);
CREATE UNIQUE INDEX tenants_tenantuser_user_id_tenant_id_unique ON tenants_tenantuser(user_id, tenant_id);
'''
        )
    else:
        schema_editor.execute('DROP TABLE IF EXISTS tenants_tenantuser')


class Migration(migrations.Migration):

    dependencies = [
        ("tenants", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(recreate_tenantuser_forward, recreate_tenantuser_reverse),
    ]
