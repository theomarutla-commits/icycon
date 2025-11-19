from django.db import migrations


def ensure_backlink_table(apps, schema_editor):
    connection = schema_editor.connection
    if 'seo_backlink' in connection.introspection.table_names():
        return

    Backlink = apps.get_model('seo', 'Backlink')
    schema_editor.create_model(Backlink)


class Migration(migrations.Migration):

    dependencies = [
        ('seo', '0004_merge'),
    ]

    operations = [
        migrations.RunPython(ensure_backlink_table, migrations.RunPython.noop),
    ]
